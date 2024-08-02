<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'locked_amount',
    ];

    protected $casts = [
        'amount' => 'integer',
        'locked_amount' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getAvailableAmount()
    {
        return $this->amount - $this->locked_amount;
    }
}