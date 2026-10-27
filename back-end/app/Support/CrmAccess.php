<?php

namespace App\Support;

use App\Models\Account;
use App\Models\Activity;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;

/**
 * Shared record scopes for CRM authorization.
 * Managers and admins can access the full internal CRM. Representatives can
 * access their assigned records (plus unassigned inbound leads). Clients are
 * restricted to records belonging to their assigned account.
 */
class CrmAccess
{
    public static function isManager(User $user): bool
    {
        return in_array($user->role, ['admin', 'manager'], true);
    }

    public static function isInternal(User $user): bool
    {
        return in_array($user->role, ['admin', 'manager', 'rep'], true);
    }

    public static function accounts(User $user): Builder
    {
        $query = Account::query();

        if (self::isManager($user)) {
            return $query;
        }

        if ($user->role === 'client') {
            return $user->account_id
                ? $query->whereKey($user->account_id)
                : $query->where('email', $user->email);
        }

        if ($user->role === 'rep') {
            return $query->where(function (Builder $accounts) use ($user) {
                if (Schema::hasColumn('accounts', 'created_by')) {
                    $accounts->where('created_by', $user->id)
                        ->orWhereHas('deals', fn (Builder $deals) => $deals->where('user_id', $user->id))
                        ->orWhereHas('quotes', fn (Builder $quotes) => $quotes->where('user_id', $user->id))
                        ->orWhereHas('leads', fn (Builder $leads) => $leads->where('user_id', $user->id));
                } else {
                    $accounts->whereHas('deals', fn (Builder $deals) => $deals->where('user_id', $user->id))
                        ->orWhereHas('quotes', fn (Builder $quotes) => $quotes->where('user_id', $user->id))
                        ->orWhereHas('leads', fn (Builder $leads) => $leads->where('user_id', $user->id));
                }
            });
        }

        return $query->whereRaw('1 = 0');
    }

    public static function deals(User $user): Builder
    {
        $query = Deal::query();
        if (self::isManager($user)) return $query;
        if ($user->role === 'rep') return $query->where('user_id', $user->id);
        if ($user->role === 'client') {
            return $user->account_id
                ? $query->where('account_id', $user->account_id)
                : $query->whereHas('account', fn (Builder $accounts) => $accounts->where('email', $user->email));
        }
        return $query->whereRaw('1 = 0');
    }

    public static function leads(User $user): Builder
    {
        $query = Lead::query();
        if (self::isManager($user)) return $query;
        if ($user->role === 'rep') {
            return $query->where(fn (Builder $leads) => $leads->where('user_id', $user->id)->orWhereNull('user_id'));
        }
        return $query->whereRaw('1 = 0');
    }

    public static function quotes(User $user): Builder
    {
        $query = Quote::query();
        if (self::isManager($user)) return $query;
        if ($user->role === 'rep') return $query->where('user_id', $user->id);
        if ($user->role === 'client') {
            return $user->account_id
                ? $query->where('account_id', $user->account_id)
                : $query->whereHas('account', fn (Builder $accounts) => $accounts->where('email', $user->email));
        }
        return $query->whereRaw('1 = 0');
    }

    public static function activities(User $user): Builder
    {
        $query = Activity::query();
        if (self::isManager($user)) return $query;
        if ($user->role === 'rep') return $query->where('user_id', $user->id);
        if ($user->role === 'client') {
            return $user->account_id
                ? $query->where('account_id', $user->account_id)
                : $query->whereHas('account', fn (Builder $accounts) => $accounts->where('email', $user->email));
        }
        return $query->whereRaw('1 = 0');
    }

    public static function requireInternal(User $user): void
    {
        abort_unless(self::isInternal($user), 403);
    }

    public static function requireManager(User $user): void
    {
        abort_unless(self::isManager($user), 403);
    }

    public static function requireRecord(Builder $scope, int|string $id): mixed
    {
        return $scope->whereKey($id)->firstOrFail();
    }
}
