<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Offer extends Model
{

    public function land(): BelongsTo
    {
        return $this->belongsTo(Land::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($offer) {
            $user = $offer->user;
            if (!$user) {
                throw new \Exception('User not found for this offer.');
            }
            if (!$user->lockCp($offer->price)) {
                throw new \Exception('Insufficient CP to place the offer.');
            }
        });

        static::updating(function ($offer) {
            $user = $offer->user;
            $originalPrice = $offer->getOriginal('price');

            if ($offer->isDirty('price')) {
                $newPrice = $offer->price;
                $priceDifference = $newPrice - $originalPrice;

                if ($priceDifference > 0) {
                    if (!$user->lockCp($priceDifference)) {
                        throw new \Exception('Insufficient CP to update the offer.');
                    }
                } else {
                    $user->unlockCp(abs($priceDifference));
                }
            }
        });

        static::deleted(function ($offer) {
            if (!$offer->is_accepted) {
                $user = $offer->user;
                $user->unlockCp($offer->price);
            }
        });
    }
}
