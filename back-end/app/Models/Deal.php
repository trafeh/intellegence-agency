<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'account_id',
        'user_id',
        'amount',
        'stage',
        'probability',
        'expected_close_date',
        'ai_recommendation',
        'products',
        'lost_reason',
    ];

    protected $casts = [
        'amount' => 'float',
        'probability' => 'integer',
        'products' => 'array',
        'expected_close_date' => 'date',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }
}
