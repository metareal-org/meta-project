<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'id' => 1,
            'address' => '0xf1af65097b91bcced87707af44531433c759b508',
            'nickname' => 'danial',
            'avatar_url' => 'https://models.readyplayer.me/66803b9acf0c40608affd1dd.glb?quality=low&meshLod=0',
            'current_mission' => 7,
            'remember_token' => null,
            'created_at' => '2024-06-29 16:51:28',
            'updated_at' => '2024-06-29 17:09:27',
        ]);
    }
}
