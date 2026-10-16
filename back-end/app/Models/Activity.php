<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'deal_id',
        'lead_id',
        'account_id',
        'type',
        'title',
        'description',
        'scheduled_at',
        'completed',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'completed' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
