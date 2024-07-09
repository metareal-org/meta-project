<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;


    public function ownedLands(): HasMany
    {
        return $this->hasMany(Land::class, 'owner_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'buyer_id');
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class);
    }

    public function getCpAmountTotalAttribute(): int
    {
        return $this->cp_amount_free + $this->cp_amount_locked;
    }

    public function getMetaAmountTotalAttribute(): int
    {
        return $this->meta_amount_free + $this->meta_amount_locked;
    }
}
