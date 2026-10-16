<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'industry',
        'annual_revenue',
        'city',
        'phone',
        'email',
        'website',
        'status',
        'primary_contact',
        'notes',
    ];

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    public function leads()
    {
        return $this->hasMany(Lead::class);
    }

    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }
}
