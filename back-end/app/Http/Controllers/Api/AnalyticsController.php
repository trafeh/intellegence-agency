<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\CrmAccess;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function kpis(Request $request)
    {
        $user = $request->user();
        $deals = CrmAccess::deals($user);
        $quotes = CrmAccess::quotes($user);
        $leads = CrmAccess::leads($user);
        $accounts = CrmAccess::accounts($user);

        // KPI definitions preserve the existing dashboard semantics:
        // - pipeline is the sum of visible deals not won/lost;
        // - win rate is won deals / all visible deals, including open and lost deals;
        // - quote acceptance and lead conversion use Accepted/Converted over all visible rows;
        // - "active" account/lead counts mean all visible rows (the current behavior has no status filter);
        // - funnel counts/sums the named stages and recent activity is the latest ten visible rows by id.
        $totalPipeline = (clone $deals)->whereNotIn('stage', ['won', 'lost'])->sum('amount');
        $closedWonRevenue = (clone $deals)->where('stage', 'won')->sum('amount');
        $totalDeals = (clone $deals)->count();
        $wonDeals = (clone $deals)->where('stage', 'won')->count();
        $winRate = $totalDeals > 0 ? round(($wonDeals / $totalDeals) * 100, 1) : 0;

        $totalQuotes = (clone $quotes)->count();
        $acceptedQuotes = (clone $quotes)->where('status', 'Accepted')->count();
        $quoteAcceptanceRate = $totalQuotes > 0 ? round(($acceptedQuotes / $totalQuotes) * 100, 1) : 0;

        $leadCount = (clone $leads)->count();
        $convertedLeads = (clone $leads)->where('status', 'Converted')->count();
        $leadConversionRate = $leadCount > 0 ? round(($convertedLeads / $leadCount) * 100, 1) : 0;

        // Stage breakdown
        $stages = ['leads', 'qualification', 'discovery', 'proposal', 'negotiation', 'won'];
        $funnel = [];
        foreach ($stages as $stage) {
            $count = (clone $deals)->where('stage', $stage)->count();
            $val = (clone $deals)->where('stage', $stage)->sum('amount');
            $funnel[] = [
                'stage' => ucfirst($stage),
                'count' => $count,
                'amount' => (float)$val,
            ];
        }

        // Recent activities
        $activityUser = $user->role === 'client'
            ? fn ($query) => $query->select('users.id', 'users.name')
            : fn ($query) => $query;
        $activities = CrmAccess::activities($user)->with([
            'user' => $activityUser,
            'deal' => fn ($query) => $query->whereIn('deals.id', CrmAccess::deals($user)->select('deals.id')),
            'account' => fn ($query) => $query->whereIn('accounts.id', CrmAccess::accounts($user)->select('accounts.id')),
        ])
            ->orderBy('id', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_pipeline' => (float)$totalPipeline,
                'closed_won_revenue' => (float)$closedWonRevenue,
                'win_rate' => $winRate,
                'quote_acceptance_rate' => $quoteAcceptanceRate,
                'lead_conversion_rate' => $leadConversionRate,
                'active_accounts_count' => $accounts->count(),
                'active_leads_count' => $leadCount,
                'funnel' => $funnel,
                'recent_activities' => $activities,
            ]
        ]);
    }
}
