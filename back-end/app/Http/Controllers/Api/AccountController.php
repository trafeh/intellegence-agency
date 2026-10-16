<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Account;

class AccountController extends Controller
{
    public function index()
    {
        $accounts = Account::withCount(['deals', 'quotes'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $accounts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'industry' => 'nullable|string',
            'annual_revenue' => 'nullable|string',
            'city' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'website' => 'nullable|string',
            'primary_contact' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $account = Account::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Compte entreprise créé avec succès',
            'data' => $account
        ], 201);
    }

    public function show($id)
    {
        $account = Account::with(['deals.quotes', 'quotes.items', 'leads'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $account
        ]);
    }
}
