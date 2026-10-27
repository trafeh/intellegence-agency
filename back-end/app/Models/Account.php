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
        'tier',
        'primary_contact',
        'ice',
        'if_number',
        'rc_number',
        'patente',
        'notes',
        'created_by',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

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
