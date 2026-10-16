<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;
use App\Models\Account;
use App\Models\Deal;

class LeadController extends Controller
{
    /**
     * List all leads with user assignment and account
     */
    public function index()
    {
        $leads = Lead::with(['user', 'account'])
            ->orderBy('ai_score', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $leads
        ]);
    }

    /**
     * Create new lead
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'company' => 'required|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'source' => 'nullable|string',
            'status' => 'nullable|string',
            'ai_score' => 'nullable|integer|min:0|max:100',
            'score_reason' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $lead = Lead::create([
            'name' => $validated['name'],
            'company' => $validated['company'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'source' => $validated['source'] ?? 'Direct Web Lead',
            'status' => $validated['status'] ?? 'New',
            'ai_score' => $validated['ai_score'] ?? rand(50, 85),
            'score_reason' => $validated['score_reason'] ?? 'Inbound lead with verified enterprise domain.',
            'user_id' => $validated['user_id'] ?? ($request->user() ? $request->user()->id : 1),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lead créé avec succès',
            'data' => $lead->load('user')
        ], 201);
    }

    /**
     * Convert lead to Account + Deal
     */
    public function convert(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $validated = $request->validate([
            'deal_amount' => 'required|numeric|min:0',
            'deal_title' => 'nullable|string',
        ]);

        // 1. Create or link Account
        $account = Account::firstOrCreate(
            ['name' => $lead->company],
            [
                'city' => 'Casablanca',
                'industry' => 'Technology & Services',
                'phone' => $lead->phone,
                'email' => $lead->email,
                'primary_contact' => $lead->name,
                'status' => 'Active',
            ]
        );

        // 2. Create Deal
        $deal = Deal::create([
            'title' => $validated['deal_title'] ?? ("Solution IA - " . $lead->company),
            'account_id' => $account->id,
            'user_id' => $lead->user_id ?? 1,
            'amount' => $validated['deal_amount'],
            'stage' => 'qualification',
            'probability' => 30,
            'expected_close_date' => now()->addDays(30),
            'ai_recommendation' => 'Lead converted. Schedule discovery session with ' . $lead->name,
        ]);

        // 3. Mark Lead as Converted
        $lead->status = 'Converted';
        $lead->account_id = $account->id;
        $lead->save();

        return response()->json([
            'success' => true,
            'message' => 'Lead converti avec succès en Entreprise et Opportunité !',
            'data' => [
                'account' => $account,
                'deal' => $deal,
                'lead' => $lead,
            ]
        ]);
    }
}
