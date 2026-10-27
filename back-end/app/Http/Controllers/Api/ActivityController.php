<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Activity;
use App\Support\CrmAccess;
use App\Support\ActivityIdempotency;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

class ActivityController extends Controller
{
    /**
     * List activities - Scoped by Role
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $activityUser = $user->role === 'client'
            ? fn ($query) => $query->select('users.id', 'users.name')
            : fn ($query) => $query;
        $limit = min((int) $request->query('limit', 150), 300);
        $activities = CrmAccess::activities($user)->with([
            'user' => $activityUser,
            'deal' => fn ($query) => $query->whereIn('deals.id', CrmAccess::deals($user)->select('deals.id')),
            'account' => fn ($query) => $query->whereIn('accounts.id', CrmAccess::accounts($user)->select('accounts.id')),
            'lead' => fn ($query) => $query->whereIn('leads.id', CrmAccess::leads($user)->select('leads.id')),
        ])->orderByDesc('id')->limit($limit)->get();

        return response()->json([
            'success' => true,
            'data' => $activities
        ]);
    }

    /**
     * Create new activity
     */
    public function store(Request $request)
    {
        CrmAccess::requireInternal($request->user());
        $key = ActivityIdempotency::key((string) $request->header('Idempotency-Key', ''));
        $validated = $request->validate([
            'deal_id' => 'nullable|exists:deals,id',
            'lead_id' => 'nullable|exists:leads,id',
            'account_id' => 'nullable|exists:accounts,id',
            'type' => 'required|string',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'scheduled_at' => 'nullable|date',
            'completed' => 'nullable|boolean',
            'user_id' => 'prohibited',
        ]);

        $deal = !empty($validated['deal_id'])
            ? CrmAccess::requireRecord(CrmAccess::deals($request->user()), $validated['deal_id'])
            : null;
        $lead = !empty($validated['lead_id'])
            ? CrmAccess::requireRecord(CrmAccess::leads($request->user()), $validated['lead_id'])
            : null;
        $accountId = $validated['account_id'] ?? $deal?->account_id ?? $lead?->account_id;
        if ($accountId) {
            CrmAccess::requireRecord(CrmAccess::accounts($request->user()), $accountId);
            $accountId = (int) $accountId;
        }
        abort_unless(!$deal || !$accountId || (int) $deal->account_id === (int) $accountId, 422, 'Activity and deal account mismatch.');
        abort_unless(!$lead || !$accountId || !$lead->account_id || (int) $lead->account_id === (int) $accountId, 422, 'Activity and lead account mismatch.');

        $payload = [
            'deal_id' => $deal?->id,
            'lead_id' => $lead?->id,
            'account_id' => $accountId,
            'type' => $validated['type'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            // Keep an omitted timestamp stable across retries; the persisted value
            // is assigned only on the first successful request.
            'scheduled_at' => $validated['scheduled_at'] ?? null,
            'completed' => (bool) ($validated['completed'] ?? false),
        ];
        $fingerprint = ActivityIdempotency::fingerprint(['operation' => 'activity.create'] + $payload);
        if ($existing = ActivityIdempotency::replay($request->user(), $key, $fingerprint)) {
            return response()->json([
                'success' => true,
                'message' => 'Activité déjà enregistrée',
                'data' => $existing->load(['user', 'deal', 'account']),
            ]);
        }

        try {
            $activity = DB::transaction(fn () => Activity::create([
                ...$payload,
                'user_id' => $request->user()->id,
                'scheduled_at' => $validated['scheduled_at'] ?? now(),
                'idempotency_key' => $key,
                'idempotency_hash' => $fingerprint,
            ]));
        } catch (QueryException $exception) {
            if (!ActivityIdempotency::isUniqueConflict($exception)) {
                throw $exception;
            }
            $activity = ActivityIdempotency::replay($request->user(), $key, $fingerprint);
            if (!$activity) {
                throw $exception;
            }

            return response()->json([
                'success' => true,
                'message' => 'Activité déjà enregistrée',
                'data' => $activity->load(['user', 'deal', 'account']),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Activité enregistrée avec succès',
            'data' => $activity->load(['user', 'deal', 'account'])
        ], 201);
    }

    /**
     * Mark activity as completed
     */
    public function markComplete(Request $request, $id)
    {
        CrmAccess::requireInternal($request->user());
        $activity = CrmAccess::requireRecord(CrmAccess::activities($request->user()), $id);
        $activity->completed = true;
        $activity->save();

        return response()->json([
            'success' => true,
            'message' => 'Activité marquée comme terminée',
            'data' => $activity
        ]);
    }
}
