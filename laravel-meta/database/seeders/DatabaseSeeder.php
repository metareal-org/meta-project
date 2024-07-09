<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Land;
use App\Models\Offer;
use App\Models\Transaction;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create users
        $this->call([LandSeeder::class]);

        $CP = 5000;
        $META = 5000000;
        // $MISSION = 8;
        $MISSION = 0;

        User::create([
            'id' => 1,
            'address' => '0xf1af65097b91bcced87707af44531433c759b508',
            'nickname' => 'Danial',
            'avatar_url' => 'https://models.readyplayer.me/66867f93539979578e555229.glb?quality=low&meshLod=0',
            'cp_amount' => $CP,
            'meta_amount' => $META,
            'coordinates' => null,
            'current_mission' => $MISSION,
            'remember_token' => null,
            'created_at' => '2024-07-04 10:55:04',
            'updated_at' => '2024-07-04 10:56:04',
        ]);

        User::create([
            'id' => 2,
            'address' => '0x' . substr(md5(mt_rand()), 0, 40),
            'nickname' => 'User2',
            'cp_amount' => 800,
            'meta_amount' => 400,
            'current_mission' => 2,
        ]);

        // Create additional users for more diverse offers
        for ($i = 3; $i <= 10; $i++) {
            User::create([
                'id' => $i,
                'address' => '0x' . substr(md5(mt_rand()), 0, 40),
                'nickname' => 'User' . $i,
                'cp_amount' => random_int(100, 1000),
                'meta_amount' => random_int(0, 500),
                'current_mission' => random_int(1, 10),
            ]);
        }


        // Create offers for every land
        foreach (Land::all() as $land) {
            $offerCount = random_int(1, 5); // Each land will have 1 to 5 offers
            for ($i = 1; $i <= $offerCount; $i++) {
                Offer::create([
                    'land_id' => $land->id,
                    'user_id' => random_int(1, 10), // Use the expanded user pool
                    'price' => random_int($land->fixed_price ?: 100, ($land->fixed_price ?: 100) * 1.5),
                    'is_accepted' => false, // Set to false initially
                ]);
            }
        }

        // Create transactions
        for ($i = 1; $i <= 10; $i++) {
            Transaction::create([
                'land_id' => random_int(1000, 1100),
                'seller_id' => random_int(1, 10),
                'buyer_id' => random_int(1, 10),
                'price' => random_int(100, 1000),
            ]);
        }
    }
}
