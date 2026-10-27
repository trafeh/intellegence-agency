<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('login', function (Request $request) {
            $emailKey = hash('sha256', Str::lower(trim((string) $request->input('email', ''))));
            $response = fn (Request $request, array $headers) => response()->json([
                'success' => false,
                'message' => 'Too many login attempts. Please try again later.',
            ], 429, $headers);

            return [
                Limit::perMinute(5)->by('login|'.$request->ip().'|'.$emailKey)->response($response),
                Limit::perMinute(30)->by('login|'.$request->ip())->response($response),
            ];
        });
    }
}
