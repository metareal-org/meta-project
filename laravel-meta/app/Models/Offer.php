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
}
