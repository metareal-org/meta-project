<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Land extends Model
{
    protected $appends = ['type', 'owner_nickname', 'last_auction_id'];

    protected function type(): Attribute
    {
        return Attribute::make(
            get: fn() => "building",
        );
    }
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

    protected function lastAuctionId(): Attribute
    {
        return Attribute::make(
            get: function () {
                return $this->lastAuction->id ?? null;
            },
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

    public function activeAuction()
    {
        return $this->auctions()->where('status', 'active')->latest()->first();
    }
}
