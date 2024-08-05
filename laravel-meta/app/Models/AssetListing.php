<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'asset_type',
        'amount',
        'price_in_bnb',
        'is_active',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}