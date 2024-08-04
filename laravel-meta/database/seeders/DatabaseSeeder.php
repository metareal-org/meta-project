<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Asset;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::getBank();
        $this->call([QuestSeeder::class]);

        $MISSION = 8;

        $users = [
            [
                'id' => 2,
                'address' => '0x9597f9189314db0a3c0c14544bf411e172f42274',
                'nickname' => 'Danial',
                'avatar_url' => 'https://models.readyplayer.me/66867f93539979578e555229.glb?quality=low&meshLod=0',
                'coordinates' => null,
                'current_mission' => $MISSION,
                'remember_token' => null,
                'created_at' => '2024-07-04 10:55:04',
                'updated_at' => '2024-07-04 10:56:04',
            ],
            [
                'id' => 3,
                'address' => '0x271f54d12539cbd9aaca4c8c9c7c093aa8351007',
                'nickname' => 'Charger',
                'avatar_url' => 'https://models.readyplayer.me/668e7d66d77fc1238ca3fab1.glb?quality=low&meshLod=0',
                'coordinates' => null,
                'current_mission' => $MISSION,
                'remember_token' => null,
                'created_at' => '2024-07-04 10:55:04',
                'updated_at' => '2024-07-04 10:56:04',
            ]
        ];

        foreach ($users as $userData) {
            $user = User::create($userData);

            // Add or update BNB for the user
            $bnbAsset = Asset::where('user_id', $user->id)
                ->where('type', 'bnb')
                ->first();

            if ($bnbAsset) {
                $bnbAsset->amount = 500000;
                $bnbAsset->save();

            } else {
                Asset::create([
                    'user_id' => $user->id,
                    'type' => 'bnb',
                    'amount' => 500000,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            $assetTypes = ['cp', 'cp_locked', 'meta', 'meta_locked', 'bnb_locked', 'iron', 'wood', 'sand', 'gold', 'ticket', 'giftbox', 'chest_silver', 'chest_gold', 'chest_diamond', 'scratch_box'];

            foreach ($assetTypes as $type) {
                Asset::firstOrCreate(
                    ['user_id' => $user->id, 'type' => $type],
                    ['amount' => 0, 'created_at' => now(), 'updated_at' => now()]
                );
            }
        }


        $this->call(UserRewardsTableSeeder::class);
        $this->call(UserQuestsTableSeeder::class);
        $this->call(TransactionsTableSeeder::class);
        $this->call(ScratchBoxLandTableSeeder::class);
        $this->call(ScratchBoxesTableSeeder::class);
        $this->call(RewardsTableSeeder::class);
        $this->call(QuestsTableSeeder::class);
        $this->call(PersonalAccessTokensTableSeeder::class);
        $this->call(OffersTableSeeder::class);
        $this->call(MigrationsTableSeeder::class);
        $this->call(LandVersionsTableSeeder::class);
        $this->call(LandsTableSeeder::class);
        $this->call(JobBatchesTableSeeder::class);
        $this->call(JobsTableSeeder::class);
        $this->call(GiftBoxContentsTableSeeder::class);
        $this->call(GiftBoxesTableSeeder::class);
        $this->call(FailedJobsTableSeeder::class);
        $this->call(CurrenciesTableSeeder::class);
        $this->call(CacheLocksTableSeeder::class);
        $this->call(CacheTableSeeder::class);
        $this->call(AuctionBidsTableSeeder::class);
        $this->call(AuctionsTableSeeder::class);
        $this->call(AssetsTableSeeder::class);

    }
}
