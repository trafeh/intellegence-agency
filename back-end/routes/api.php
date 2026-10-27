<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DealController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\PublicQuoteController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\ActivityController;

/*
|--------------------------------------------------------------------------
| API Routes - Intelligence Sales CRM
|--------------------------------------------------------------------------
*/

// --- 1. Public Client Portal Routes (No Authentication Required) ---
Route::prefix('public')->group(function () {
    Route::get('/quotes/{token}', [PublicQuoteController::class, 'show'])->middleware('throttle:30,1');
    Route::post('/quotes/{token}/accept', [PublicQuoteController::class, 'accept'])->middleware('throttle:10,1');
    Route::post('/proposals', [LeadController::class, 'publicStore'])->middleware('throttle:15,1');
});

// --- 2. Public Authentication ---
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:login');

// --- 3. Protected CRM Routes (Sanctum Authentication Required) ---
Route::middleware('auth:sanctum')->group(function () {

    // Auth profile & logout
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/users', [AuthController::class, 'users']);

    // Deals (Pipeline & Opportunities)
    Route::prefix('deals')->group(function () {
        Route::get('/', [DealController::class, 'index']);
        Route::post('/', [DealController::class, 'store']);
        Route::get('/{id}', [DealController::class, 'show']);
        Route::put('/{id}', [DealController::class, 'update']);
        Route::put('/{id}/stage', [DealController::class, 'updateStage']);
        Route::delete('/{id}', [DealController::class, 'destroy']);
    });

    // Leads (Prospecting & Scoring)
    Route::prefix('leads')->group(function () {
        Route::get('/', [LeadController::class, 'index']);
        Route::post('/', [LeadController::class, 'store']);
        Route::get('/{id}', [LeadController::class, 'show']);
        Route::put('/{id}', [LeadController::class, 'update']);
        Route::post('/{id}/convert', [LeadController::class, 'convert']);
        Route::delete('/{id}', [LeadController::class, 'destroy']);
    });

    // Accounts (Enterprise Clients)
    Route::prefix('accounts')->group(function () {
        Route::get('/', [AccountController::class, 'index']);
        Route::post('/', [AccountController::class, 'store']);
        Route::get('/{id}', [AccountController::class, 'show']);
        Route::put('/{id}', [AccountController::class, 'update']);
        Route::delete('/{id}', [AccountController::class, 'destroy']);
    });

    // Quotes & Commercial Proposals (Devis)
    Route::prefix('quotes')->group(function () {
        Route::get('/', [QuoteController::class, 'index']);
        Route::post('/', [QuoteController::class, 'store']);
        Route::get('/{id}', [QuoteController::class, 'show']);
        Route::put('/{id}', [QuoteController::class, 'update']);
        Route::post('/{id}/approve-discount', [QuoteController::class, 'approveDiscount']);
        Route::post('/{id}/revoke-public-token', [QuoteController::class, 'revokePublicToken']);
        Route::post('/{id}/send', [QuoteController::class, 'sendToClient']);
        Route::post('/{id}/record-acceptance', [QuoteController::class, 'recordAcceptance']);
        Route::delete('/{id}', [QuoteController::class, 'destroy']);
    });

    // Activities & Follow-ups
    Route::prefix('activities')->group(function () {
        Route::get('/', [ActivityController::class, 'index']);
        Route::post('/', [ActivityController::class, 'store']);
        Route::post('/{id}/complete', [ActivityController::class, 'markComplete']);
    });

    // Executive Analytics & KPIs
    Route::get('/analytics/kpis', [AnalyticsController::class, 'kpis']);
});
