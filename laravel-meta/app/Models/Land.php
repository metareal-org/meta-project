<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Land extends Model
{
    protected $appends = ['owner_nickname', 'has_active_auction', 'minimum_bid', 'is_for_sale'];
    protected $casts = [
        'is_in_scratch' => 'boolean',
    ];
 

    protected function ownerNickname(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->owner_id) {
                    return null;
                }
                return $this->owner->nickname ?? null;
            },
        );
    }

    protected function isForSale(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->fixed_price !== null && $this->fixed_price > 0,
        );
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class);
    }

    public function auctions(): HasMany
    {
        return $this->hasMany(Auction::class);
    }

    public function activeAuction(): HasOne
    {
        return $this->hasOne(Auction::class)->active()->latest();
    }

    public function getHasActiveAuctionAttribute(): bool
    {
        return $this->activeAuction()->exists();
    }

    public function getFormattedActiveAuctionAttribute()
    {
        $activeAuction = $this->activeAuction;

        if (!$activeAuction) {
            return null;
        }

        return [
            'id' => $activeAuction->id,
            'land_id' => $activeAuction->land_id,
            'minimum_price' => $activeAuction->minimum_price,
            'end_time' => $activeAuction->end_time,
            'is_active' => $activeAuction->is_active,
            'highest_bid' => $activeAuction->highest_bid,
            'minimum_bid' => $this->minimum_bid,
            'created_at' => $activeAuction->created_at,
            'updated_at' => $activeAuction->updated_at,
            'bids' => $activeAuction->bids->sortByDesc('created_at')->values()->map(function ($bid) {
                return [
                    'id' => $bid->id,
                    'user' => [
                        'id' => $bid->user->id,
                        'nickname' => $bid->user->nickname,
                    ],
                    'user_nickname' => $bid->user->nickname,
                    'amount' => $bid->amount,
                    'created_at' => $bid->created_at,
                ];
            }),
        ];
    }

    public function getMinimumBidAttribute()
    {
        $activeAuction = $this->activeAuction;
        if (!$activeAuction) {
            return null;
        }

        $highestBid = $activeAuction->highest_bid;
        return $highestBid ? max($highestBid * 1.05, $activeAuction->minimum_price) : $activeAuction->minimum_price;
    }
    public function scratchBoxes()
    {
        return $this->belongsToMany(ScratchBox::class, 'scratch_box_land');
    }
}
    