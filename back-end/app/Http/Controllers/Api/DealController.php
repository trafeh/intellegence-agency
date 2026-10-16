<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Deal;
use App\Models\Activity;

class DealController extends Controller
{
    /**
     * List deals with account, owner and quotes - Scoped by Role
     */
    public function index(Request $request)
    {
        $user = $request->user('sanctum') ?? $request->user();
        $query = Deal::with(['account', 'user', 'quotes'])->orderBy('id', 'desc');

        if ($user) {
            if ($user->role === 'rep') {
                $query->where('user_id', $user->id);
            } elseif ($user->role === 'client') {
                $query->whereHas('account', function($q) use ($user) {
                    $q->where('contact_email', $user->email)
                      ->orWhere('name', 'like', '%MaroCraft%');
                });
            }
        }

        $deals = $query->get();

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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'account_id' => 'required|exists:accounts,id',
            'amount' => 'required|numeric|min:0',
            'stage' => 'nullable|string',
            'probability' => 'nullable|integer|min:0|max:100',
            'expected_close_date' => 'nullable|date',
            'products' => 'nullable|array',
            'ai_recommendation' => 'nullable|string',
        ]);

        $deal = Deal::create([
            'title' => $validated['title'],
            'account_id' => $validated['account_id'],
            'user_id' => $request->user() ? $request->user()->id : 1,
            'amount' => $validated['amount'],
            'stage' => $validated['stage'] ?? 'leads',
            'probability' => $validated['probability'] ?? 20,
            'expected_close_date' => $validated['expected_close_date'] ?? now()->addDays(30),
            'products' => $validated['products'] ?? [],
            'ai_recommendation' => $validated['ai_recommendation'] ?? 'Opportunity created. Next step: Qualify requirements.',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Deal créé avec succès',
            'data' => $deal->load(['account', 'user'])
        ], 201);
    }

    /**
     * Update deal stage (Kanban Drag and Drop)
     */
    public function updateStage(Request $request, $id)
    {
        $deal = Deal::findOrFail($id);

        $validated = $request->validate([
            'stage' => 'required|string|in:leads,qualification,discovery,proposal,negotiation,won,lost',
            'lost_reason' => 'nullable|string',
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

        $deal->stage = $validated['stage'];
        $deal->probability = $stageProbabilities[$validated['stage']] ?? $deal->probability;

        if ($validated['stage'] === 'lost' && !empty($validated['lost_reason'])) {
            $deal->lost_reason = $validated['lost_reason'];
        }

        $deal->save();

        // Log stage update activity
        Activity::create([
            'user_id' => $request->user() ? $request->user()->id : ($deal->user_id ?? 1),
            'deal_id' => $deal->id,
            'account_id' => $deal->account_id,
            'type' => 'note',
            'title' => "Phase changée : " . strtoupper($deal->stage),
            'description' => "L'opportunité '{$deal->title}' est passée à l'étape {$deal->stage}.",
            'scheduled_at' => now(),
            'completed' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Étape mise à jour vers {$deal->stage}",
            'data' => $deal->load(['account', 'user'])
        ]);
    }

    /**
     * Get single deal details
     */
    public function show($id)
    {
        $deal = Deal::with(['account', 'user', 'quotes.items', 'activities'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $deal
        ]);
    }
}
