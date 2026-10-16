<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuoteItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_id',
        'description',
        'qty',
        'unit_price',
        'total',
    ];

    protected $casts = [
        'qty' => 'integer',
        'unit_price' => 'float',
        'total' => 'float',
    ];

    public function quote()
    {
        return $this->belongsTo(Quote::class);
    }
}
