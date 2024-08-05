<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetTrade extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'asset_type',
        'amount',
        'price',
    ];

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}