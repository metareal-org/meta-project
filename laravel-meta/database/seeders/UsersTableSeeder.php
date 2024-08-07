<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{


    public function run()
    {


        \DB::table('users')->delete();

        \DB::table('users')->insert(array(
            0 =>
            array(
                'id' => 1,
                'role' => 1,
                'address' => '0x0000000000000000000000000000000000000000',
                'nickname' => 'Bank',
                'avatar_url' => NULL,
                'coordinates' => NULL,
                'current_mission' => 8,
                'referrer_id' => NULL,
                'referral_code' => 'BANK',
                'remember_token' => NULL,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            1 =>
            array(
                'id' => 2,
                'role' => 1,
                'address' => '0x9597f9189314db0a3c0c14544bf411e172f42274',
                'nickname' => 'Danial',
                'avatar_url' => 'https://models.readyplayer.me/66867f93539979578e555229.glb?quality=low&meshLod=0',
                'coordinates' => NULL,
                'current_mission' => 8,
                'referrer_id' => NULL,
                'referral_code' => '2',
                'remember_token' => NULL,
                'created_at' => '2024-07-04 10:55:04',
                'updated_at' => '2024-07-04 10:56:04',
            ),
            2 =>
            array(
                'id' => 3,
                'role' => 0,
                'address' => '0x271f54d12539cbd9aaca4c8c9c7c093aa8351007',
                'nickname' => 'Charger',
                'avatar_url' => 'https://models.readyplayer.me/668e7d66d77fc1238ca3fab1.glb?quality=low&meshLod=0',
                'coordinates' => NULL,
                'current_mission' => 8,
                'referrer_id' => NULL,
                'referral_code' => '3',
                'remember_token' => NULL,
                'created_at' => '2024-07-04 10:55:04',
                'updated_at' => '2024-07-04 10:56:04',
            ),
        ));
    }
}
