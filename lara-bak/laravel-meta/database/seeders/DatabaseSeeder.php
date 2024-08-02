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
        // Create lands
        $this->call([LandSeeder::class]);
        $CP = 5000;
        // $CP = 0;
        $META = 0;
        $META = 5000000;
        $MISSION = 8;
        // $MISSION = 0;

        // Create User 1
        User::create([
            'id' => 1,
            'address' => '0x9597f9189314db0a3c0c14544bf411e172f42274',
            'nickname' => 'Danial',
            'avatar_url' => 'https://models.readyplayer.me/66867f93539979578e555229.glb?quality=low&meshLod=0',
            'cp_amount_free' => $CP,
            'meta_amount_free' => $META,
            'coordinates' => null,
            'current_mission' => $MISSION,
            'remember_token' => null,
            'created_at' => '2024-07-04 10:55:04',
            'updated_at' => '2024-07-04 10:56:04',
        ]);
        User::create([
            'id' => 2,
            'address' => '0x271f54d12539cbd9aaca4c8c9c7c093aa8351007',
            'nickname' => 'Charger',
            'avatar_url' => 'https://models.readyplayer.me/668e7d66d77fc1238ca3fab1.glb?quality=low&meshLod=0',
            'cp_amount_free' => $CP,
            'meta_amount_free' => $META,
            'coordinates' => null,
            'current_mission' => $MISSION,
            'remember_token' => null,
            'created_at' => '2024-07-04 10:55:04',
            'updated_at' => '2024-07-04 10:56:04',
        ]);
        // Create additional users
        // for ($i = 3; $i <= 10; $i++) {
        //     User::create([
        //         'id' => $i,
        //         'address' => '0x' . substr(md5(mt_rand()), 0, 40),
        //         'nickname' => 'User' . $i,
        //         'cp_amount_free' => $CP,
        //         'meta_amount_free' => $META,
        //         'current_mission' => random_int(1, 10),
        //     ]);
        // }

        // Get all valid user IDs
        $userIds = User::pluck('id')->toArray();

        // Create offers for every land
        // foreach (Land::all() as $land) {
        //     $offerCount = random_int(1, 5); // Each land will have 1 to 5 offers
        //     for ($i = 1; $i <= $offerCount; $i++) {
        //         $userId = $userIds[array_rand($userIds)]; // Randomly select a valid user ID
        //         $user = User::find($userId);
        //         $price = random_int($land->fixed_price ?: 100, ($land->fixed_price ?: 100) * 1.5);

        //         // Check if user has enough CP before creating the offer
        //         if ($user->cp_amount_free >= $price) {
        //             Offer::create([
        //                 'land_id' => $land->id,
        //                 'user_id' => $userId,
        //                 'price' => $price,
        //                 'is_accepted' => false,
        //             ]);
        //         }
        //     }
        // }

        // Create transactions
        // for ($i = 1; $i <= 10; $i++) {
        //     Transaction::create([
        //         'land_id' => random_int(1000, 1100),
        //         'seller_id' => $userIds[array_rand($userIds)],
        //         'buyer_id' => $userIds[array_rand($userIds)],
        //         'price' => random_int(100, 1000),
        //     ]);
        // }
    }
}
