<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Deal;
use App\Models\Activity;
use App\Support\CrmAccess;
use App\Support\ActivityIdempotency;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class DealController extends Controller
{
    /**
     * List deals with account, owner and quotes - Scoped by Role
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $deals = CrmAccess::deals($user)->with([
            'account', 'user',
            'quotes' => fn ($query) => $query->whereIn('quotes.id', CrmAccess::quotes($user)->select('quotes.id')),
        ])->orderByDesc('id')->get();

        return response()->json([
            'success' => true,
            'data' => $deals
        ]);
    }

    /**
     * Store new deal
     */
    public function store(Request $request)
    {
        CrmAccess::requireInternal($request->user());
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric|min:0',
            'stage' => 'nullable|string|in:leads,qualification,discovery,proposal,negotiation',
            'probability' => 'nullable|integer|min:0|max:100',
            'expected_close_date' => 'nullable|date',
            'products' => 'nullable|array',
            'ai_recommendation' => 'nullable|string',
            'user_id' => CrmAccess::isManager($request->user()) ? 'nullable|exists:users,id' : 'prohibited',
        ]);

        CrmAccess::requireRecord(CrmAccess::accounts($request->user()), $validated['account_id']);

        $userId = CrmAccess::isManager($request->user())
            ? ($validated['user_id'] ?? $request->user()->id)
            : $request->user()->id;

        $deal = Deal::create([
            'title' => $validated['title'],
            'account_id' => $validated['account_id'],
            'user_id' => $userId,
            'amount' => $validated['amount'],
            'stage' => $validated['stage'] ?? 'leads',
            'probability' => $validated['probability'] ?? 20,
            'expected_close_date' => $validated['expected_close_date'] ?? now()->addDays(30),
            'products' => $validated['products'] ?? [],
            'ai_recommendation' => $validated['ai_recommendation'] ?? 'Opportunity created. Next step: Qualify requirements.',
        ]);

        Activity::create([
            'user_id' => $request->user()->id,
            'deal_id' => $deal->id,
            'account_id' => $deal->account_id,
            'type' => 'deal_created',
            'title' => "Nouvelle opportunité : {$deal->title}",
            'description' => "Création de l'opportunité pour " . number_format($deal->amount, 0, ',', ' ') . " MAD à l'étape " . strtoupper($deal->stage),
            'scheduled_at' => now(),
            'completed' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Deal créé avec succès',
            'data' => $deal->load(['account', 'user'])
        ], 201);
    }

    /**
     * Update deal full details
     */
    public function update(Request $request, $id)
    {
        CrmAccess::requireInternal($request->user());
        $deal = CrmAccess::requireRecord(CrmAccess::deals($request->user()), $id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'account_id' => 'sometimes|required|exists:accounts,id',
            'amount' => 'sometimes|required|numeric|min:0',
            'stage' => 'prohibited',
            'probability' => 'nullable|integer|min:0|max:100',
            'expected_close_date' => 'nullable|date',
            'products' => 'nullable|array',
            'ai_recommendation' => 'nullable|string',
            'lost_reason' => 'nullable|string',
            'user_id' => CrmAccess::isManager($request->user()) ? 'nullable|exists:users,id' : 'prohibited',
        ]);

        if (isset($validated['account_id'])) {
            CrmAccess::requireRecord(CrmAccess::accounts($request->user()), $validated['account_id']);
        }

        $oldUserId = (int) $deal->user_id;

        $deal->update($validated);

        if (isset($validated['user_id']) && CrmAccess::isManager($request->user()) && (int) $validated['user_id'] !== $oldUserId) {
            $newRep = \App\Models\User::find($validated['user_id']);
            Activity::create([
                'user_id' => $request->user()->id,
                'deal_id' => $deal->id,
                'account_id' => $deal->account_id,
                'type' => 'deal_assigned',
                'title' => "Opportunité réassignée à " . ($newRep?->name ?? 'un nouveau commercial'),
                'description' => "L'opportunité '{$deal->title}' a été assignée à " . ($newRep?->name ?? "l'utilisateur #{$validated['user_id']}") . " par {$request->user()->name}.",
                'scheduled_at' => now(),
                'completed' => true,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Deal mis à jour avec succès',
            'data' => $deal->load(['account', 'user'])
        ]);
    }

    /**
     * Update deal stage (Kanban Drag and Drop)
     */
    public function updateStage(Request $request, $id)
    {
        CrmAccess::requireInternal($request->user());
        $deal = CrmAccess::requireRecord(CrmAccess::deals($request->user()), $id);

        $validated = $request->validate([
            'stage' => 'required|string|in:leads,qualification,discovery,proposal,negotiation,won,lost',
            'lost_reason' => 'nullable|string',
        ]);

        $key = ActivityIdempotency::key((string) $request->header('Idempotency-Key', ''));
        $fingerprint = ActivityIdempotency::fingerprint([
            'operation' => 'deal.stage',
            'deal_id' => (int) $deal->id,
            'stage' => $validated['stage'],
            'lost_reason' => $validated['lost_reason'] ?? null,
        ]);

        $stageProbabilities = [
            'leads' => 10,
            'qualification' => 25,
            'discovery' => 40,
            'proposal' => 60,
            'negotiation' => 80,
            'won' => 100,
            'lost' => 0,
        ];

        try {
            $deal = DB::transaction(function () use ($id, $validated, $stageProbabilities, $request, $key, $fingerprint) {
                // Lock through the same authorization scope so concurrent stage
                // changes serialize without widening record access.
                $deal = CrmAccess::requireRecord(CrmAccess::deals($request->user())->lockForUpdate(), $id);

                if ($existing = ActivityIdempotency::replay($request->user(), $key, $fingerprint)) {
                    return CrmAccess::requireRecord(CrmAccess::deals($request->user()), $existing->deal_id);
                }

                abort_if($validated['stage'] === 'won', 422, 'A deal can only be won by accepting an eligible quote.');
                abort_if($deal->stage === 'won', 409, 'A won deal cannot be reopened through the stage endpoint.');

                $deal->stage = $validated['stage'];
                $deal->probability = $stageProbabilities[$validated['stage']] ?? $deal->probability;

                if ($validated['stage'] === 'lost' && !empty($validated['lost_reason'])) {
                    $deal->lost_reason = $validated['lost_reason'];
                }
                $deal->save();

                Activity::create([
                    'user_id' => $request->user()->id,
                    'deal_id' => $deal->id,
                    'account_id' => $deal->account_id,
                    'type' => 'note',
                    'title' => "Phase changée : " . strtoupper($deal->stage),
                    'description' => "L'opportunité '{$deal->title}' est passée à l'étape {$deal->stage}.",
                    'scheduled_at' => now(),
                    'completed' => true,
                    'idempotency_key' => $key,
                    'idempotency_hash' => $fingerprint,
                ]);

                return $deal;
            });
        } catch (QueryException $exception) {
            if (!ActivityIdempotency::isUniqueConflict($exception)) {
                throw $exception;
            }
            $existing = ActivityIdempotency::replay($request->user(), $key, $fingerprint);
            if (!$existing) {
                throw $exception;
            }
            $deal = CrmAccess::requireRecord(CrmAccess::deals($request->user()), $existing->deal_id);
        }

        $deal->load(['account', 'user']);

        return response()->json([
            'success' => true,
            'message' => "Étape mise à jour vers {$deal->stage}",
            'data' => $deal->load(['account', 'user'])
        ]);
    }

    /**
     * Delete deal
     */
    public function destroy(Request $request, $id)
    {
        CrmAccess::requireInternal($request->user());
        $deal = CrmAccess::requireRecord(CrmAccess::deals($request->user()), $id);
        $deal->delete();

        return response()->json([
            'success' => true,
            'message' => 'Deal supprimé avec succès'
        ]);
    }

    /**
     * Get single deal details
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();
        $deal = CrmAccess::requireRecord(CrmAccess::deals($user)->with([
            'account', 'user',
            'quotes' => fn ($query) => $query->whereIn('quotes.id', CrmAccess::quotes($user)->select('quotes.id')),
            'quotes.items',
            'activities' => fn ($query) => $query->whereIn('activities.id', CrmAccess::activities($user)->select('activities.id')),
        ]), $id);

        return response()->json([
            'success' => true,
            'data' => $deal
        ]);
    }
}
