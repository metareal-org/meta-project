<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LandVersion extends Model
{
    use HasFactory;

    protected $fillable = ['data', 'file_name', 'version_name', 'is_active'];

    protected $casts = [
        'data' => 'array',
        'is_active' => 'boolean',
        'is_locked' => 'boolean',
    ];
}