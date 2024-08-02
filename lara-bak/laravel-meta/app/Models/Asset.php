<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    
    public function increase($assetType, $amount)
    {
        if (isset($this->$assetType)) {
            $this->$assetType += $amount;
            $this->save();
            return true;
        }
        return false;
    }

    public function decrease($assetType, $amount)
    {
        if (isset($this->$assetType) && $this->$assetType >= $amount) {
            $this->$assetType -= $amount;
            $this->save();
            return true;
        }
        return false;
    }
}
