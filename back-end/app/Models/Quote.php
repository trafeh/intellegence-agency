<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_number',
        'deal_id',
        'account_id',
        'user_id',
        'client_name',
        'client_email',
        'client_company',
        'status',
        'subtotal',
        'discount_percent',
        'discount_amount',
        'discount_approved',
        'tax_percent',
        'tax_amount',
        'total_amount',
        'currency',
        'expiry_date',
        'public_token',
        'client_signed_at',
        'client_signer_name',
        'client_po_number',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'discount_percent' => 'float',
        'discount_amount' => 'float',
        'discount_approved' => 'boolean',
        'tax_percent' => 'float',
        'tax_amount' => 'float',
        'total_amount' => 'float',
        'expiry_date' => 'date',
        'client_signed_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($quote) {
            if (empty($quote->public_token)) {
                $quote->public_token = Str::random(32);
            }
        });
    }

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(QuoteItem::class);
    }
}
