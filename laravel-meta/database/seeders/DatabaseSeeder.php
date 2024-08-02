<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;


class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::getBank();
        // $this->call([LandSeeder::class]);
        $this->call([QuestSeeder::class]);
        $MISSION = 8;
        User::create([
            'id' => 2,
            'address' => '0x9597f9189314db0a3c0c14544bf411e172f42274',
            'nickname' => 'Danial',
            'avatar_url' => 'https://models.readyplayer.me/66867f93539979578e555229.glb?quality=low&meshLod=0',
            'coordinates' => null,
            'current_mission' => $MISSION,
            'remember_token' => null,
            'created_at' => '2024-07-04 10:55:04',
            'updated_at' => '2024-07-04 10:56:04',
        ]);
        User::create([
            'id' => 3,
            'address' => '0x271f54d12539cbd9aaca4c8c9c7c093aa8351007',
            'nickname' => 'Charger',
            'avatar_url' => 'https://models.readyplayer.me/668e7d66d77fc1238ca3fab1.glb?quality=low&meshLod=0',
            'coordinates' => null,
            'current_mission' => $MISSION,
            'remember_token' => null,
            'created_at' => '2024-07-04 10:55:04',
            'updated_at' => '2024-07-04 10:56:04',
        ]);
    }
}
