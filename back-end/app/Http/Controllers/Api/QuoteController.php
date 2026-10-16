<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\Deal;
use App\Models\Account;
use App\Models\Activity;

class QuoteController extends Controller
{
    /**
     * List all quotes with relationships
     */
    public function index()
    {
        $quotes = Quote::with(['deal', 'account', 'user', 'items'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $quotes
        ]);
    }

    /**
     * Store new quote
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'deal_id' => 'nullable|exists:deals,id',
            'client_name' => 'nullable|string',
            'client_email' => 'nullable|email',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'expiry_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $account = Account::findOrFail($validated['account_id']);
        $discountPercent = floatval($validated['discount_percent'] ?? 0);

        // Subtotal calculation
        $subtotal = 0;
        foreach ($validated['items'] as $item) {
            $subtotal += ($item['qty'] * $item['unit_price']);
        }

        $discountAmount = ($subtotal * $discountPercent) / 100;
        $discountedSubtotal = $subtotal - $discountAmount;
        $taxPercent = 20.0; // TVA Maroc standard 20%
        $taxAmount = ($discountedSubtotal * $taxPercent) / 100;
        $totalAmount = $discountedSubtotal + $taxAmount;

        // Manager approval required if discount > 15%
        $requiresApproval = $discountPercent > 15;
        $status = $requiresApproval ? 'Pending Approval' : 'Sent';

        // Auto quote number
        $quoteCount = Quote::count() + 1;
        $quoteNumber = 'Q-2026-' . str_pad($quoteCount, 3, '0', STR_PAD_LEFT);

        $userId = $request->user() ? $request->user()->id : 1;

        $quote = Quote::create([
            'quote_number' => $quoteNumber,
            'deal_id' => $validated['deal_id'] ?? null,
            'account_id' => $account->id,
            'user_id' => $userId,
            'client_name' => $validated['client_name'] ?? $account->primary_contact,
            'client_email' => $validated['client_email'] ?? $account->email,
            'client_company' => $account->name,
            'status' => $status,
            'subtotal' => $subtotal,
            'discount_percent' => $discountPercent,
            'discount_amount' => $discountAmount,
            'discount_approved' => !$requiresApproval,
            'tax_percent' => $taxPercent,
            'tax_amount' => $taxAmount,
            'total_amount' => $totalAmount,
            'currency' => 'MAD',
            'expiry_date' => $validated['expiry_date'] ?? now()->addDays(30),
            'public_token' => Str::random(32),
            'notes' => $validated['notes'] ?? null,
        ]);

        // Insert quote items
        foreach ($validated['items'] as $item) {
            QuoteItem::create([
                'quote_id' => $quote->id,
                'description' => $item['description'],
                'qty' => $item['qty'],
                'unit_price' => $item['unit_price'],
                'total' => $item['qty'] * $item['unit_price'],
            ]);
        }

        // Auto-promote associated deal to 'proposal' stage if earlier
        if (!empty($validated['deal_id'])) {
            $deal = Deal::find($validated['deal_id']);
            if ($deal && in_array($deal->stage, ['leads', 'qualification', 'discovery'])) {
                $deal->stage = 'proposal';
                $deal->probability = max($deal->probability, 60);
                $deal->ai_recommendation = "Formal quote {$quote->quote_number} generated. Follow up within 3 days.";
                $deal->save();
            }
        }

        // Log activity
        Activity::create([
            'user_id' => $userId,
            'deal_id' => $quote->deal_id,
            'account_id' => $quote->account_id,
            'type' => 'quote',
            'title' => "Devis {$quote->quote_number} généré",
            'description' => "Devis de " . number_format($quote->total_amount, 2) . " MAD créé pour {$account->name}.",
            'scheduled_at' => now(),
            'completed' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Devis généré avec succès',
            'data' => $quote->load(['deal', 'account', 'user', 'items'])
        ], 201);
    }

    /**
     * Manager Approves Discount > 15%
     */
    public function approveDiscount(Request $request, $id)
    {
        $quote = Quote::findOrFail($id);
        $quote->discount_approved = true;
        if ($quote->status === 'Pending Approval') {
            $quote->status = 'Sent';
        }
        $quote->save();

        Activity::create([
            'user_id' => $request->user() ? $request->user()->id : 2, // Manager
            'deal_id' => $quote->deal_id,
            'account_id' => $quote->account_id,
            'type' => 'note',
            'title' => "Remise {$quote->discount_percent}% approuvée par la Direction",
            'description' => "Validation managériale de la remise accordée sur le devis {$quote->quote_number}.",
            'scheduled_at' => now(),
            'completed' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Remise de {$quote->discount_percent}% approuvée avec succès",
            'data' => $quote->load(['deal', 'account', 'user', 'items'])
        ]);
    }

    /**
     * Mark quote as Sent to client
     */
    public function sendToClient(Request $request, $id)
    {
        $quote = Quote::findOrFail($id);
        $quote->status = 'Sent';
        $quote->save();

        return response()->json([
            'success' => true,
            'message' => "Devis {$quote->quote_number} marqué comme transmis au client",
            'data' => $quote
        ]);
    }

    /**
     * Commercial records client PO (Bon de Commande) / Acceptance
     */
    public function recordAcceptance(Request $request, $id)
    {
        $quote = Quote::findOrFail($id);

        $validated = $request->validate([
            'client_signer_name' => 'required|string',
            'client_po_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $quote->status = 'Accepted';
        $quote->client_signed_at = now();
        $quote->client_signer_name = $validated['client_signer_name'];
        $quote->client_po_number = $validated['client_po_number'] ?? 'BC-' . date('Y') . '-' . rand(1000, 9999);
        if (!empty($validated['notes'])) {
            $quote->notes = ($quote->notes ? $quote->notes . "\n" : '') . $validated['notes'];
        }
        $quote->save();

        // Automatically mark Deal as WON
        if ($quote->deal_id) {
            $deal = Deal::find($quote->deal_id);
            if ($deal) {
                $deal->stage = 'won';
                $deal->probability = 100;
                $deal->ai_recommendation = "Closed Won! Bon de commande {$quote->client_po_number} validé.";
                $deal->save();
            }
        }

        Activity::create([
            'user_id' => $request->user() ? $request->user()->id : 1,
            'deal_id' => $quote->deal_id,
            'account_id' => $quote->account_id,
            'type' => 'note',
            'title' => "Contrat Validé (Bon de commande reçu)",
            'description' => "Devis {$quote->quote_number} accepté par {$quote->client_signer_name}. Bon de commande: {$quote->client_po_number}.",
            'scheduled_at' => now(),
            'completed' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Accord client et Bon de commande enregistrés avec succès !',
            'data' => $quote->load(['deal', 'account', 'user', 'items'])
        ]);
    }

    /**
     * Show single quote
     */
    public function show($id)
    {
        $quote = Quote::with(['deal', 'account', 'user', 'items'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $quote
        ]);
    }
}
