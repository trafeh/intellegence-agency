<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Account;
use App\Support\CrmAccess;

class AccountController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $accounts = CrmAccess::accounts($user)
            ->withCount([
                'deals' => fn ($query) => $query->whereIn('deals.id', CrmAccess::deals($user)->select('deals.id')),
                'quotes' => fn ($query) => $query->whereIn('quotes.id', CrmAccess::quotes($user)->select('quotes.id')),
            ])
            ->orderByDesc('id')->get();

        return response()->json([
            'success' => true,
            'data' => $accounts
        ]);
    }

    public function store(Request $request)
    {
        CrmAccess::requireInternal($request->user());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'industry' => 'nullable|string',
            'annual_revenue' => 'nullable|string',
            'city' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'website' => 'nullable|string',
            'status' => 'nullable|string',
            'tier' => 'nullable|string',
            'primary_contact' => 'nullable|string',
            'ice' => 'nullable|string|max:20',
            'if_number' => 'nullable|string|max:20',
            'rc_number' => 'nullable|string|max:30',
            'patente' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);

        $account = Account::create([...$validated, 'created_by' => $request->user()->id]);

        return response()->json([
            'success' => true,
            'message' => 'Compte entreprise créé avec succès',
            'data' => $account
        ], 201);
    }

    public function update(Request $request, $id)
    {
        CrmAccess::requireInternal($request->user());
        $account = CrmAccess::requireRecord(CrmAccess::accounts($request->user()), $id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'industry' => 'nullable|string',
            'annual_revenue' => 'nullable|string',
            'city' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'website' => 'nullable|string',
            'status' => 'nullable|string',
            'tier' => 'nullable|string',
            'primary_contact' => 'nullable|string',
            'ice' => 'nullable|string|max:20',
            'if_number' => 'nullable|string|max:20',
            'rc_number' => 'nullable|string|max:30',
            'patente' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);

        $account->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Compte entreprise mis à jour avec succès',
            'data' => $account
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        CrmAccess::requireManager($user);
        $account = CrmAccess::requireRecord(CrmAccess::accounts($user), $id);
        $account->delete();

        return response()->json([
            'success' => true,
            'message' => 'Compte entreprise supprimé avec succès'
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $account = CrmAccess::requireRecord(
            CrmAccess::accounts($user)->with([
                'deals' => fn ($query) => $query->whereIn('deals.id', CrmAccess::deals($user)->select('deals.id')),
                'deals.quotes' => fn ($query) => $query->whereIn('quotes.id', CrmAccess::quotes($user)->select('quotes.id')),
                'deals.quotes.items',
                'quotes' => fn ($query) => $query->whereIn('quotes.id', CrmAccess::quotes($user)->select('quotes.id')),
                'quotes.items',
                'leads' => fn ($query) => $query->whereIn('leads.id', CrmAccess::leads($user)->select('leads.id')),
            ]),
            $id
        );

        return response()->json([
            'success' => true,
            'data' => $account
        ]);
    }
}
