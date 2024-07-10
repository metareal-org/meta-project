<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Land extends Model
{
    protected $appends = ['type', 'owner_nickname'];

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
}
