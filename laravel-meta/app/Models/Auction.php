<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Auction extends Model
{

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function land(): BelongsTo
    {
        return $this->belongsTo(Land::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function bids(): HasMany
    {
        return $this->hasMany(AuctionBid::class);
    }

    public function highestBid(): ?AuctionBid
    {
        return $this->bids()->orderBy('amount', 'desc')->first();
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function extendEndTime(): void
    {
        $this->end_time = $this->end_time->addMinutes(10);
        $this->save();
    }
}
