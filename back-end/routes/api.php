<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DealController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\QuoteController;
use App\Http\Controllers\Api\PublicQuoteController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\AnalyticsController;

/*
|--------------------------------------------------------------------------
| API Routes - Intelligence Sales CRM
|--------------------------------------------------------------------------
*/

// --- 1. Public Client Portal Routes (No Authentication Required) ---
Route::prefix('public')->group(function () {
    Route::get('/quotes/{token}', [PublicQuoteController::class, 'show']);
    Route::post('/quotes/{token}/accept', [PublicQuoteController::class, 'accept']);
});

// --- 2. Authentication Routes ---
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// --- 3. Team & Users ---
Route::get('/users', [AuthController::class, 'users']);

// --- 4. Deals (Pipeline & Opportunities) ---
Route::prefix('deals')->group(function () {
    Route::get('/', [DealController::class, 'index']);
    Route::post('/', [DealController::class, 'store']);
    Route::put('/{id}/stage', [DealController::class, 'updateStage']);
    Route::get('/{id}', [DealController::class, 'show']);
});

// --- 5. Leads ---
Route::prefix('leads')->group(function () {
    Route::get('/', [LeadController::class, 'index']);
    Route::post('/', [LeadController::class, 'store']);
    Route::post('/{id}/convert', [LeadController::class, 'convert']);
});

// --- 6. Accounts (Client Enterprises) ---
Route::prefix('accounts')->group(function () {
    Route::get('/', [AccountController::class, 'index']);
    Route::post('/', [AccountController::class, 'store']);
    Route::get('/{id}', [AccountController::class, 'show']);
});

// --- 7. Quotes & Proposals (Devis) ---
Route::prefix('quotes')->group(function () {
    Route::get('/', [QuoteController::class, 'index']);
    Route::post('/', [QuoteController::class, 'store']);
    Route::get('/{id}', [QuoteController::class, 'show']);
    Route::post('/{id}/approve-discount', [QuoteController::class, 'approveDiscount']);
    Route::post('/{id}/send', [QuoteController::class, 'sendToClient']);
    Route::post('/{id}/record-acceptance', [QuoteController::class, 'recordAcceptance']);
});

// --- 8. Executive Analytics & KPIs ---
Route::get('/analytics/kpis', [AnalyticsController::class, 'kpis']);
