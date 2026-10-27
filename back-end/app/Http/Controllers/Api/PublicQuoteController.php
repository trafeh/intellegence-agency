<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Quote;

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
        abort_if($quote->public_token_revoked_at, 410, 'This quote link has been revoked.');
        abort_unless(in_array($quote->status, ['Sent', 'Accepted'], true), 404);

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

        $validated = $request->validate([
            'signer_name' => 'required|string|min:2|max:255',
            'po_number' => 'nullable|string|max:255',
            'comment' => 'nullable|string',
        ]);

        $result = QuoteController::acceptQuote(
            $quote,
            $request,
            $validated['signer_name'],
            $validated['po_number'] ?? null,
            isset($validated['comment']) ? 'Commentaire Client: ' . $validated['comment'] : null
        );
        return response()->json($result['body'], $result['status']);
    }
}
