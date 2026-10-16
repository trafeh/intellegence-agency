<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Quote;
use App\Models\Deal;
use App\Models\Activity;

class PublicQuoteController extends Controller
{
    /**
     * Get Quote by Public Secret Token (For Client Portal)
     */
    public function show($token)
    {
        $quote = Quote::with(['account', 'deal', 'user', 'items'])
            ->where('public_token', $token)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $quote->id,
                'quote_number' => $quote->quote_number,
                'status' => $quote->status,
                'client_company' => $quote->client_company,
                'client_name' => $quote->client_name,
                'client_email' => $quote->client_email,
                'expiry_date' => $quote->expiry_date ? $quote->expiry_date->format('Y-m-d') : null,
                'is_expired' => $quote->expiry_date ? $quote->expiry_date->isPast() : false,
                'subtotal' => $quote->subtotal,
                'discount_percent' => $quote->discount_percent,
                'discount_amount' => $quote->discount_amount,
                'tax_percent' => $quote->tax_percent,
                'tax_amount' => $quote->tax_amount,
                'total_amount' => $quote->total_amount,
                'currency' => $quote->currency,
                'notes' => $quote->notes,
                'items' => $quote->items,
                'client_signed_at' => $quote->client_signed_at,
                'client_signer_name' => $quote->client_signer_name,
                'client_po_number' => $quote->client_po_number,
                'sales_representative' => [
                    'name' => $quote->user->name ?? 'Karim Tazi',
                    'title' => $quote->user->title ?? 'Account Executive',
                    'email' => $quote->user->email ?? 'sales@intelligencesales.com',
                    'phone' => $quote->user->phone ?? '+212 522-000000',
                ]
            ]
        ]);
    }

    /**
     * Client electronically accepts & signs the quote
     */
    public function accept(Request $request, $token)
    {
        $quote = Quote::where('public_token', $token)->firstOrFail();

        if ($quote->status === 'Accepted') {
            return response()->json([
                'success' => true,
                'message' => 'Ce devis a déjà été validé et signé.',
                'already_accepted' => true,
                'data' => $quote
            ]);
        }

        $validated = $request->validate([
            'signer_name' => 'required|string|min:2',
            'po_number' => 'nullable|string',
            'comment' => 'nullable|string',
        ]);

        $poNumber = !empty($validated['po_number'])
            ? $validated['po_number']
            : 'BC-' . date('Y') . '-' . rand(1000, 9999);

        $quote->status = 'Accepted';
        $quote->client_signed_at = now();
        $quote->client_signer_name = $validated['signer_name'];
        $quote->client_po_number = $poNumber;
        if (!empty($validated['comment'])) {
            $quote->notes = ($quote->notes ? $quote->notes . "\n" : '') . "Commentaire Client: " . $validated['comment'];
        }
        $quote->save();

        // Automatically promote associated deal to WON in CRM
        if ($quote->deal_id) {
            $deal = Deal::find($quote->deal_id);
            if ($deal) {
                $deal->stage = 'won';
                $deal->probability = 100;
                $deal->ai_recommendation = "Closed Won via Client Portal! Bon de commande {$poNumber} signé par {$validated['signer_name']}.";
                $deal->save();
            }
        }

        // Log official audit activity
        Activity::create([
            'user_id' => $quote->user_id ?? 1,
            'deal_id' => $quote->deal_id,
            'account_id' => $quote->account_id,
            'type' => 'note',
            'title' => "Signature électronique client reçue",
            'description' => "Le client {$validated['signer_name']} a validé le devis {$quote->quote_number} en ligne. Bon de commande émis: {$poNumber}.",
            'scheduled_at' => now(),
            'completed' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Devis validé et signé avec succès ! Votre bon de commande a été généré.',
            'po_number' => $poNumber,
            'signed_at' => $quote->client_signed_at->toIso8601String(),
            'data' => $quote->load(['items', 'account'])
        ]);
    }
}
