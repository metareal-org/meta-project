<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Auction extends Model
{
    protected $fillable = ['land_id', 'minimum_price', 'end_time'];

    protected $casts = [
        'end_time' => 'datetime',
    ];

    public function land(): BelongsTo
    {
        return $this->belongsTo(Land::class);
    }

    public function bids(): HasMany
    {
        return $this->hasMany(AuctionBid::class);
    }

    public function getIsActiveAttribute(): bool
    {
        return $this->end_time->isFuture();
    }

    public function scopeActive($query)
    {
        return $query->where('end_time', '>', now())->where('status', 'active');
    }

    public function highestBid()
    {
        return $this->bids()->orderBy('amount', 'desc')->first();
    }

    public function getHighestBidAttribute()
    {
        $highestBid = $this->highestBid();
        return $highestBid ? $highestBid->amount : null;
    }

    public function getHighestBidderAttribute()
    {
        $highestBid = $this->highestBid();
        return $highestBid ? $highestBid->user : null;
    }
}