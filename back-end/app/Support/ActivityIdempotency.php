<?php

namespace App\Support;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Database\QueryException;

class ActivityIdempotency
{
    public static function key(string $key): string
    {
        abort_unless((bool) preg_match('/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/', $key), 422, 'A valid Idempotency-Key UUID header is required.');

        return strtolower($key);
    }

    public static function fingerprint(array $payload): string
    {
        return hash('sha256', json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));
    }

    public static function replay(User $user, string $key, string $fingerprint): ?Activity
    {
        $existing = Activity::query()
            ->where('user_id', $user->id)
            ->where('idempotency_key', $key)
            ->first();

        if (!$existing) {
            return null;
        }

        abort_unless($existing->idempotency_hash && hash_equals($existing->idempotency_hash, $fingerprint), 409, 'This idempotency key was already used for a different operation.');
        CrmAccess::requireRecord(CrmAccess::activities($user), $existing->id);

        return $existing;
    }

    public static function isUniqueConflict(QueryException $exception): bool
    {
        return in_array((string) $exception->getCode(), ['23000', '23505', '19'], true)
            || str_contains(strtolower($exception->getMessage()), 'unique constraint');
    }
}
