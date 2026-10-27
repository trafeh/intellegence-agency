<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Deal;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Support\CrmAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class QuoteController extends Controller
{
    private const DISCOUNT_APPROVAL_THRESHOLD = 15.0;

    public function index(Request $request)
    {
        $user = $request->user();
        $quotes = CrmAccess::quotes($user)->with([
            'deal' => fn ($query) => $query->whereIn('deals.id', CrmAccess::deals($user)->select('deals.id')),
            'account' => fn ($query) => $query->whereIn('accounts.id', CrmAccess::accounts($user)->select('accounts.id')),
            'user', 'items',
        ])->orderByDesc('id')->get();

        return response()->json(['success' => true, 'data' => $quotes]);
    }

    public function store(Request $request)
    {
        CrmAccess::requireInternal($request->user());
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
            'user_id' => 'prohibited',
            'status' => 'prohibited',
            'discount_approved' => 'prohibited',
            'public_token' => 'prohibited',
        ]);

        $account = CrmAccess::requireRecord(CrmAccess::accounts($request->user()), $validated['account_id']);
        $deal = null;
        if (!empty($validated['deal_id'])) {
            $deal = CrmAccess::requireRecord(CrmAccess::deals($request->user()), $validated['deal_id']);
            abort_unless((int) $deal->account_id === (int) $account->id, 422, 'The deal and quote must belong to the same account.');
        }

        $quote = DB::transaction(function () use ($validated, $account, $deal, $request) {
            $discountPercent = (float) ($validated['discount_percent'] ?? 0);
            $subtotal = collect($validated['items'])->sum(fn ($item) => $item['qty'] * $item['unit_price']);
            $discountAmount = round($subtotal * $discountPercent / 100, 2);
            $discountedSubtotal = $subtotal - $discountAmount;
            $taxPercent = 20.0;
            $taxAmount = round($discountedSubtotal * $taxPercent / 100, 2);
            $requiresApproval = $discountPercent > self::DISCOUNT_APPROVAL_THRESHOLD;
            $quoteCount = Quote::count() + 1;

            $quote = Quote::create([
                'quote_number' => 'Q-' . now()->format('Y') . '-' . str_pad((string) $quoteCount, 3, '0', STR_PAD_LEFT),
                'deal_id' => $deal?->id,
                'account_id' => $account->id,
                'user_id' => $request->user()->id,
                'client_name' => $validated['client_name'] ?? $account->primary_contact,
                'client_email' => $validated['client_email'] ?? $account->email,
                'client_company' => $account->name,
                'status' => $requiresApproval ? 'Pending Approval' : 'Sent',
                'subtotal' => $subtotal,
                'discount_percent' => $discountPercent,
                'discount_amount' => $discountAmount,
                'discount_approved' => !$requiresApproval,
                'tax_percent' => $taxPercent,
                'tax_amount' => $taxAmount,
                'total_amount' => $discountedSubtotal + $taxAmount,
                'currency' => 'MAD',
                'expiry_date' => $validated['expiry_date'] ?? now()->addDays(30),
                'public_token' => Str::random(48),
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                QuoteItem::create([
                    'quote_id' => $quote->id,
                    'description' => $item['description'],
                    'qty' => $item['qty'],
                    'unit_price' => $item['unit_price'],
                    'total' => round($item['qty'] * $item['unit_price'], 2),
                ]);
            }

            if ($deal && in_array($deal->stage, ['leads', 'qualification', 'discovery'], true)) {
                $deal->stage = 'proposal';
                $deal->probability = max($deal->probability, 60);
                $deal->ai_recommendation = "Formal quote {$quote->quote_number} generated. Follow up within 3 days.";
                $deal->save();
            }

            Activity::create([
                'user_id' => $request->user()->id,
                'deal_id' => $quote->deal_id,
                'account_id' => $quote->account_id,
                'type' => 'quote',
                'title' => "Devis {$quote->quote_number} généré",
                'description' => "Devis de " . number_format($quote->total_amount, 2) . " MAD créé pour {$account->name}.",
                'scheduled_at' => now(),
                'completed' => true,
            ]);

            return $quote;
        });

        return response()->json([
            'success' => true,
            'message' => 'Devis généré avec succès',
            'data' => $quote->load(['deal', 'account', 'user', 'items']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        CrmAccess::requireInternal($request->user());
        $quote = CrmAccess::requireRecord(CrmAccess::quotes($request->user()), $id);
        abort_unless(in_array($quote->status, ['Draft', 'Pending Approval'], true), 409, 'Only a draft or pending quote can be edited.');

        $validated = $request->validate([
            'client_name' => 'nullable|string',
            'client_email' => 'nullable|email',
            'expiry_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'status' => 'prohibited',
            'discount_approved' => 'prohibited',
            'discount_percent' => 'prohibited',
            'user_id' => 'prohibited',
            'account_id' => 'prohibited',
            'deal_id' => 'prohibited',
        ]);
        $quote->update($validated);

        return response()->json(['success' => true, 'data' => $quote->load(['deal', 'account', 'user', 'items'])]);
    }

    public function approveDiscount(Request $request, $id)
    {
        CrmAccess::requireManager($request->user());
        $quote = CrmAccess::requireRecord(Quote::query(), $id);
        abort_unless($quote->status === 'Pending Approval'
            && $quote->discount_percent > self::DISCOUNT_APPROVAL_THRESHOLD
            && !$quote->public_token_revoked_at, 409, 'This quote is not awaiting discount approval.');

        DB::transaction(function () use ($quote, $request) {
            $quote = Quote::whereKey($quote->id)->lockForUpdate()->firstOrFail();
            abort_unless($quote->status === 'Pending Approval'
                && $quote->discount_percent > self::DISCOUNT_APPROVAL_THRESHOLD
                && !$quote->public_token_revoked_at, 409, 'This quote is not awaiting discount approval.');
            $quote->discount_approved = true;
            $quote->status = 'Sent';
            $quote->save();

            Activity::create([
                'user_id' => $request->user()->id,
                'deal_id' => $quote->deal_id,
                'account_id' => $quote->account_id,
                'type' => 'note',
                'title' => "Remise {$quote->discount_percent}% approuvée par la Direction",
                'description' => "Validation managériale de la remise accordée sur le devis {$quote->quote_number}.",
                'scheduled_at' => now(),
                'completed' => true,
            ]);
        });

        return response()->json(['success' => true, 'message' => 'Remise approuvée.', 'data' => $quote->fresh()->load(['deal', 'account', 'user', 'items'])]);
    }

    public function sendToClient(Request $request, $id)
    {
        CrmAccess::requireInternal($request->user());
        $quote = CrmAccess::requireRecord(CrmAccess::quotes($request->user()), $id);
        if ($quote->status === 'Sent') {
            return response()->json(['success' => true, 'message' => 'Quote is already sent.', 'data' => $quote]);
        }
        abort_unless(in_array($quote->status, ['Draft', 'Pending Approval'], true), 409, 'This quote cannot be sent in its current state.');
        abort_unless($quote->discount_percent <= self::DISCOUNT_APPROVAL_THRESHOLD, 403, 'Discount approval is required before sending.');
        abort_if($quote->public_token_revoked_at, 409, 'The public quote token has been revoked.');

        $quote->status = 'Sent';
        $quote->save();

        Activity::create([
            'user_id' => $request->user()->id,
            'deal_id' => $quote->deal_id,
            'account_id' => $quote->account_id,
            'type' => 'email',
            'title' => "Devis {$quote->quote_number} envoyé au client",
            'description' => "Devis officiel transmis au client ({$quote->client_email}) pour consultation et signature.",
            'scheduled_at' => now(),
            'completed' => true,
        ]);

        return response()->json(['success' => true, 'message' => "Devis {$quote->quote_number} marqué comme transmis au client", 'data' => $quote]);
    }

    public function revokePublicToken(Request $request, $id)
    {
        CrmAccess::requireInternal($request->user());
        $quote = CrmAccess::requireRecord(CrmAccess::quotes($request->user()), $id);
        abort_if($quote->status === 'Accepted', 409, 'An accepted quote token cannot be revoked retroactively.');

        if (!$quote->public_token_revoked_at) {
            $quote->public_token_revoked_at = now();
            $quote->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Public quote token revoked.',
            'data' => $quote->load(['user', 'deal', 'account', 'items']),
        ]);
    }

    public function recordAcceptance(Request $request, $id)
    {
        CrmAccess::requireInternal($request->user());
        $quote = CrmAccess::requireRecord(CrmAccess::quotes($request->user()), $id);
        $validated = $request->validate([
            'client_signer_name' => 'required|string|min:2|max:255',
            'client_po_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $result = $this->acceptQuote($quote, $request, $validated['client_signer_name'], $validated['client_po_number'] ?? null, $validated['notes'] ?? null);
        return response()->json($result['body'], $result['status']);
    }

    public function destroy(Request $request, $id)
    {
        CrmAccess::requireInternal($request->user());
        $quote = CrmAccess::requireRecord(CrmAccess::quotes($request->user()), $id);
        abort_if($quote->status === 'Accepted', 409, 'An accepted quote cannot be deleted.');
        DB::transaction(function () use ($quote) {
            $quote->items()->delete();
            $quote->delete();
        });

        return response()->json(['success' => true, 'message' => 'Devis supprimé avec succès']);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $quote = CrmAccess::requireRecord(
            CrmAccess::quotes($user)->with([
                'deal' => fn ($query) => $query->whereIn('deals.id', CrmAccess::deals($user)->select('deals.id')),
                'account' => fn ($query) => $query->whereIn('accounts.id', CrmAccess::accounts($user)->select('accounts.id')),
                'user', 'items',
            ]),
            $id
        );
        return response()->json(['success' => true, 'data' => $quote]);
    }

    public static function acceptQuote(Quote $quote, Request $request, string $signerName, ?string $poNumber, ?string $notes = null): array
    {
        return DB::transaction(function () use ($quote, $request, $signerName, $poNumber, $notes) {
            $locked = Quote::whereKey($quote->id)->lockForUpdate()->firstOrFail();
            if ($locked->status === 'Accepted') {
                return ['status' => 200, 'body' => ['success' => true, 'already_accepted' => true, 'data' => $locked]];
            }

            abort_unless($locked->status === 'Sent', 409, 'Only a sent quote can be accepted.');
            abort_if($locked->public_token_revoked_at, 410, 'The public quote token has been revoked.');
            abort_if($locked->expiry_date && $locked->expiry_date->lt(today()), 410, 'This quote has expired.');
            abort_unless($locked->discount_percent <= self::DISCOUNT_APPROVAL_THRESHOLD || $locked->discount_approved, 403, 'Discount approval is required.');

            $deal = null;
            if ($locked->deal_id) {
                if ($request->user()) {
                    $deal = CrmAccess::requireRecord(CrmAccess::deals($request->user()), $locked->deal_id);
                } else {
                    $deal = Deal::whereKey($locked->deal_id)->firstOrFail();
                }
                abort_unless((int) $deal->account_id === (int) $locked->account_id, 409, 'Quote and deal account mismatch.');
            }

            $locked->status = 'Accepted';
            $locked->client_signed_at = now();
            $locked->client_signer_name = $signerName;
            $locked->client_po_number = $poNumber ?: 'BC-' . now()->format('Y') . '-' . random_int(1000, 9999);
            if ($notes) $locked->notes = trim(($locked->notes ? $locked->notes . "\n" : '') . $notes);
            $locked->save();

            if ($deal) {
                $deal->stage = 'won';
                $deal->probability = 100;
                $deal->ai_recommendation = "Closed Won! Bon de commande {$locked->client_po_number} validé.";
                $deal->save();
            }

            Activity::create([
                'user_id' => $request->user()?->id ?? $locked->user_id,
                'deal_id' => $locked->deal_id,
                'account_id' => $locked->account_id,
                'type' => 'note',
                'title' => 'Contrat validé (bon de commande reçu)',
                'description' => "Devis {$locked->quote_number} accepté par {$signerName}. Bon de commande: {$locked->client_po_number}.",
                'scheduled_at' => now(),
                'completed' => true,
            ]);

            return ['status' => 200, 'body' => [
                'success' => true,
                'message' => 'Devis validé et signé avec succès.',
                'po_number' => $locked->client_po_number,
                'signed_at' => $locked->client_signed_at->toIso8601String(),
                'data' => $locked->load(['items', 'account', 'deal']),
            ]];
        });
    }
}
