<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Quote;
use App\Models\Account;
use App\Models\Activity;

class AnalyticsController extends Controller
{
    public function kpis()
    {
        $totalPipeline = Deal::whereNotIn('stage', ['won', 'lost'])->sum('amount');
        $closedWonRevenue = Deal::where('stage', 'won')->sum('amount');
        $totalDeals = Deal::count();
        $wonDeals = Deal::where('stage', 'won')->count();
        $winRate = $totalDeals > 0 ? round(($wonDeals / $totalDeals) * 100, 1) : 0;

        $totalQuotes = Quote::count();
        $acceptedQuotes = Quote::where('status', 'Accepted')->count();
        $quoteAcceptanceRate = $totalQuotes > 0 ? round(($acceptedQuotes / $totalQuotes) * 100, 1) : 0;

        $leadCount = Lead::count();
        $convertedLeads = Lead::where('status', 'Converted')->count();
        $leadConversionRate = $leadCount > 0 ? round(($convertedLeads / $leadCount) * 100, 1) : 0;

        // Stage breakdown
        $stages = ['leads', 'qualification', 'discovery', 'proposal', 'negotiation', 'won'];
        $funnel = [];
        foreach ($stages as $stage) {
            $count = Deal::where('stage', $stage)->count();
            $val = Deal::where('stage', $stage)->sum('amount');
            $funnel[] = [
                'stage' => ucfirst($stage),
                'count' => $count,
                'amount' => (float)$val,
            ];
        }

        // Recent activities
        $activities = Activity::with(['user', 'deal', 'account'])
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
                'active_accounts_count' => Account::count(),
                'active_leads_count' => $leadCount,
                'funnel' => $funnel,
                'recent_activities' => $activities,
            ]
        ]);
    }
}
