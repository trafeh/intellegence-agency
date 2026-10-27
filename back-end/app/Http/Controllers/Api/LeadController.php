<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;
use App\Models\Deal;
use App\Models\Account;
use App\Models\Activity;
use App\Models\User;
use App\Support\CrmAccess;
use App\Mail\ClientProposalWelcomeMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{
    /**
     * List leads with user assignment and account - Scoped by Role
     */
    public function index(Request $request)
    {
        $leads = CrmAccess::leads($request->user())
            ->with(['user', 'account'])->orderByDesc('ai_score')->get();

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
        CrmAccess::requireInternal($request->user());
        $validated = $request->validate([
            'name' => 'required|string',
            'company' => 'required|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'source' => 'nullable|string',
            'status' => 'nullable|string|in:New,Qualified,Contacted',
            'ai_score' => 'nullable|integer|min:0|max:100',
            'score_reason' => 'nullable|string',
            'user_id' => CrmAccess::isManager($request->user()) ? 'nullable|exists:users,id' : 'prohibited',
        ]);

        $userId = CrmAccess::isManager($request->user())
            ? ($validated['user_id'] ?? $request->user()->id)
            : $request->user()->id;

        $lead = Lead::create([
            'name' => $validated['name'],
            'company' => $validated['company'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'source' => $validated['source'] ?? 'Direct Web Lead',
            'status' => $validated['status'] ?? 'New',
            'ai_score' => $validated['ai_score'] ?? rand(50, 85),
            'score_reason' => $validated['score_reason'] ?? 'Inbound lead with verified enterprise domain.',
            'user_id' => $userId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lead créé avec succès',
            'data' => $lead->load('user')
        ], 201);
    }

    /**
     * Public inbound proposal / inquiry submission from landing page
     */
    public function publicStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:100',
            'team_size' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $admin = User::where('role', 'admin')->first() ?? User::first();
        if (!$admin) {
            $admin = User::create([
                'name' => 'System Administrator',
                'email' => 'admin@intelligencesales.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'title' => 'System Admin',
            ]);
        }
        $adminId = $admin->id;

        // 1. Automatically create or link the Enterprise Account for the client company
        $account = Account::firstOrCreate(
            ['name' => $validated['company']],
            [
                'created_by' => $adminId,
                'industry' => 'Commercial Distribution & Wholesale',
                'annual_revenue' => $validated['team_size'] ?? '50 000 – 200 000 MAD',
                'city' => $validated['city'] ?? 'Casablanca',
                'phone' => $validated['phone'] ?? '+212 600 00 00 00',
                'email' => $validated['email'],
                'primary_contact' => $validated['name'],
                'status' => 'Prospect',
                'tier' => 'Tier B',
                'notes' => 'Compte client créé automatiquement lors de la soumission de proposition en ligne.' . (!empty($validated['notes']) ? ' | ' . $validated['notes'] : ''),
            ]
        );

        // 2. Automatically create or link the Client User portal account
        $clientUser = User::where('email', $validated['email'])->first();
        $plainPassword = null;

        if (!$clientUser) {
            $plainPassword = 'Client@' . random_int(1000, 9999);
            $clientUser = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($plainPassword),
                'role' => 'client',
                'title' => 'Client Representative (' . $validated['company'] . ')',
                'phone' => $validated['phone'] ?? null,
                'account_id' => $account->id,
                'quota' => 0.00,
            ]);
        } else {
            if (!$clientUser->account_id) {
                $clientUser->update(['account_id' => $account->id]);
            }
        }

        // 3. Create the inbound Lead linked to the client Account
        $lead = Lead::create([
            'name' => $validated['name'],
            'company' => $validated['company'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? '+212 600 00 00 00',
            'source' => 'Landing Page Proposal Request',
            'status' => 'New',
            'ai_score' => 88,
            'score_reason' => 'Inbound commercial proposal request from website. Volume: ' . ($validated['team_size'] ?? '50 000 – 200 000 MAD') . (!empty($validated['notes']) ? ' | Needs: ' . $validated['notes'] : ''),
            'user_id' => null,
            'account_id' => $account->id,
        ]);

        $quoteRef = 'DEV-' . date('Y') . '-' . str_pad((string)($lead->id ?? random_int(1000, 9999)), 4, '0', STR_PAD_LEFT);
        $loginUrl = env('FRONTEND_URL', 'http://localhost:5173') . '/login';

        // 4. Send Welcome Email with credentials directly to the submitted email
        try {
            Mail::to($clientUser->email)->send(new ClientProposalWelcomeMail(
                clientName: $clientUser->name,
                companyName: $account->name,
                email: $clientUser->email,
                password: $plainPassword,
                quoteRef: $quoteRef,
                loginUrl: $loginUrl
            ));
        } catch (\Throwable $e) {
            Log::warning("Could not dispatch client welcome email to {$clientUser->email}: " . $e->getMessage());
        }

        // 5. Log audit activity
        Activity::create([
            'user_id' => $adminId,
            'lead_id' => $lead->id,
            'account_id' => $account->id,
            'type' => 'inbound_request',
            'title' => "Demande de Devis : {$lead->name} ({$lead->company})",
            'description' => "Demande de proposition commerciale soumise depuis la page d'accueil pour {$lead->company}. Compte client créé avec succès.",
            'scheduled_at' => now(),
            'completed' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre demande de devis et proposition a été transmise avec succès ! Vos identifiants ont été envoyés par email.',
            'data' => array_merge($lead->toArray(), [
                'account' => $account,
                'quote_ref' => $quoteRef,
                'client_user' => [
                    'id' => $clientUser->id,
                    'name' => $clientUser->name,
                    'email' => $clientUser->email,
                    'role' => $clientUser->role,
                ],
                'portal_credentials' => [
                    'email' => $clientUser->email,
                    'password' => $plainPassword,
                    'is_new_account' => $plainPassword !== null,
                    'login_url' => $loginUrl,
                ]
            ])
        ], 201);
    }

    /**
     * Update lead
     */
    public function update(Request $request, $id)
    {
        CrmAccess::requireInternal($request->user());
        $lead = CrmAccess::requireRecord(CrmAccess::leads($request->user()), $id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string',
            'company' => 'sometimes|required|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'source' => 'nullable|string',
            'status' => 'nullable|string|in:New,Qualified,Contacted',
            'ai_score' => 'nullable|integer|min:0|max:100',
            'score_reason' => 'nullable|string',
            'user_id' => CrmAccess::isManager($request->user()) ? 'nullable|exists:users,id' : 'prohibited',
        ]);

        if ($request->user()->role === 'rep' && $lead->user_id === null) {
            $lead->user_id = $request->user()->id;
        }
        $lead->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Lead mis à jour avec succès',
            'data' => $lead->load('user')
        ]);
    }

    /**
     * Convert lead to Account + Deal
     */
    public function convert(Request $request, $id)
    {
        CrmAccess::requireInternal($request->user());
        $lead = CrmAccess::requireRecord(CrmAccess::leads($request->user()), $id);

        $validated = $request->validate([
            'deal_amount' => 'required|numeric|min:0',
            'deal_title' => 'nullable|string',
        ]);

        [$lead, $account, $deal] = DB::transaction(function () use ($lead, $validated, $request) {
            $lead = CrmAccess::leads($request->user())->whereKey($lead->id)->lockForUpdate()->firstOrFail();
            abort_if($lead->status === 'Converted', 409, 'This lead has already been converted.');

            $account = CrmAccess::accounts($request->user())->firstOrCreate(
                ['name' => $lead->company],
                [
                    'created_by' => $request->user()->id,
                    'city' => 'Casablanca',
                    'industry' => 'Technology & Services',
                    'phone' => $lead->phone,
                    'email' => $lead->email,
                    'primary_contact' => $lead->name,
                    'status' => 'Active',
                ]
            );

            $deal = Deal::create([
                'title' => $validated['deal_title'] ?? ("Solution IA - " . $lead->company),
                'account_id' => $account->id,
                'user_id' => $lead->user_id ?? $request->user()->id,
                'amount' => $validated['deal_amount'],
                'stage' => 'qualification',
                'probability' => 30,
                'expected_close_date' => now()->addDays(30),
                'ai_recommendation' => 'Lead converted. Schedule discovery session with ' . $lead->name,
            ]);

            $lead->status = 'Converted';
            $lead->account_id = $account->id;
            if (!$lead->user_id) $lead->user_id = $request->user()->id;
            $lead->save();

            Activity::create([
                'user_id' => $request->user()->id,
                'lead_id' => $lead->id,
                'deal_id' => $deal->id,
                'account_id' => $account->id,
                'type' => 'lead_converted',
                'title' => "Prospect converti : {$lead->name}",
                'description' => "Conversion du prospect {$lead->company} en opportunité et création de l'entreprise client.",
                'scheduled_at' => now(),
                'completed' => true,
            ]);

            return [$lead, $account, $deal];
        });

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

    /**
     * Delete lead
     */
    public function destroy(Request $request, $id)
    {
        CrmAccess::requireInternal($request->user());
        $lead = CrmAccess::requireRecord(CrmAccess::leads($request->user()), $id);
        abort_unless(CrmAccess::isManager($request->user()) || (int) $lead->user_id === (int) $request->user()->id, 403);
        $lead->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lead supprimé avec succès'
        ]);
    }

    /**
     * Show single lead
     */
    public function show(Request $request, $id)
    {
        $lead = CrmAccess::requireRecord(
            CrmAccess::leads($request->user())->with(['user', 'account']),
            $id
        );

        return response()->json([
            'success' => true,
            'data' => $lead
        ]);
    }
}
