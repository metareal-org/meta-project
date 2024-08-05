<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScratchBox extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'status'];

    protected $casts = [
        'price' => 'integer',
    ];

    protected $appends = ['type', 'size'];
    public function lands()
    {
        return $this->belongsToMany(Land::class, 'scratch_box_land');
    }

    public function getTypeAttribute()
    {
        return $this->lands()->count() === 1 ? 'single' : 'bulk';
    }

    public function open(User $user)
    {
        if ($this->status !== 'sold') {
            throw new \Exception('This scratch box is not available for opening.');
        }

        $lands = $this->lands;

        foreach ($lands as $land) {
            $land->update([
                'owner_id' => $user->id,
                'is_in_scratch' => false
            ]);
        }

        $this->update(['status' => 'opened']);

        return $lands;
    }

    public function assets()
    {
        return $this->hasMany(Asset::class, 'amount', 'id')->where('type', 'scratch_box');
    }

    public function getSizeAttribute()
    {
        return $this->lands()->sum('size');
    }

}