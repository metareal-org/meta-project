<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class AssetsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('assets')->delete();
        
        \DB::table('assets')->insert(array (
            0 => 
            array (
                'id' => 1,
                'user_id' => 1,
                'type' => 'cp',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            1 => 
            array (
                'id' => 2,
                'user_id' => 1,
                'type' => 'cp_locked',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            2 => 
            array (
                'id' => 3,
                'user_id' => 1,
                'type' => 'meta',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            3 => 
            array (
                'id' => 4,
                'user_id' => 1,
                'type' => 'meta_locked',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            4 => 
            array (
                'id' => 5,
                'user_id' => 1,
                'type' => 'bnb',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            5 => 
            array (
                'id' => 6,
                'user_id' => 1,
                'type' => 'bnb_locked',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            6 => 
            array (
                'id' => 7,
                'user_id' => 1,
                'type' => 'iron',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            7 => 
            array (
                'id' => 8,
                'user_id' => 1,
                'type' => 'wood',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            8 => 
            array (
                'id' => 9,
                'user_id' => 1,
                'type' => 'sand',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            9 => 
            array (
                'id' => 10,
                'user_id' => 1,
                'type' => 'gold',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            10 => 
            array (
                'id' => 11,
                'user_id' => 1,
                'type' => 'ticket',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            11 => 
            array (
                'id' => 12,
                'user_id' => 1,
                'type' => 'giftbox',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            12 => 
            array (
                'id' => 13,
                'user_id' => 1,
                'type' => 'chest_silver',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            13 => 
            array (
                'id' => 14,
                'user_id' => 1,
                'type' => 'chest_gold',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            14 => 
            array (
                'id' => 15,
                'user_id' => 1,
                'type' => 'chest_diamond',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            15 => 
            array (
                'id' => 16,
                'user_id' => 1,
                'type' => 'scratch_box',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            16 => 
            array (
                'id' => 17,
                'user_id' => 2,
                'type' => 'cp',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            17 => 
            array (
                'id' => 18,
                'user_id' => 2,
                'type' => 'cp_locked',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            18 => 
            array (
                'id' => 19,
                'user_id' => 2,
                'type' => 'meta',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            19 => 
            array (
                'id' => 20,
                'user_id' => 2,
                'type' => 'meta_locked',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            20 => 
            array (
                'id' => 21,
                'user_id' => 2,
                'type' => 'bnb',
                'amount' => 500000,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            21 => 
            array (
                'id' => 22,
                'user_id' => 2,
                'type' => 'bnb_locked',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            22 => 
            array (
                'id' => 23,
                'user_id' => 2,
                'type' => 'iron',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            23 => 
            array (
                'id' => 24,
                'user_id' => 2,
                'type' => 'wood',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            24 => 
            array (
                'id' => 25,
                'user_id' => 2,
                'type' => 'sand',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            25 => 
            array (
                'id' => 26,
                'user_id' => 2,
                'type' => 'gold',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            26 => 
            array (
                'id' => 27,
                'user_id' => 2,
                'type' => 'ticket',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            27 => 
            array (
                'id' => 28,
                'user_id' => 2,
                'type' => 'giftbox',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            28 => 
            array (
                'id' => 29,
                'user_id' => 2,
                'type' => 'chest_silver',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            29 => 
            array (
                'id' => 30,
                'user_id' => 2,
                'type' => 'chest_gold',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            30 => 
            array (
                'id' => 31,
                'user_id' => 2,
                'type' => 'chest_diamond',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            31 => 
            array (
                'id' => 32,
                'user_id' => 2,
                'type' => 'scratch_box',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            32 => 
            array (
                'id' => 33,
                'user_id' => 3,
                'type' => 'cp',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            33 => 
            array (
                'id' => 34,
                'user_id' => 3,
                'type' => 'cp_locked',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            34 => 
            array (
                'id' => 35,
                'user_id' => 3,
                'type' => 'meta',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            35 => 
            array (
                'id' => 36,
                'user_id' => 3,
                'type' => 'meta_locked',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            36 => 
            array (
                'id' => 37,
                'user_id' => 3,
                'type' => 'bnb',
                'amount' => 500000,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            37 => 
            array (
                'id' => 38,
                'user_id' => 3,
                'type' => 'bnb_locked',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            38 => 
            array (
                'id' => 39,
                'user_id' => 3,
                'type' => 'iron',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            39 => 
            array (
                'id' => 40,
                'user_id' => 3,
                'type' => 'wood',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            40 => 
            array (
                'id' => 41,
                'user_id' => 3,
                'type' => 'sand',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            41 => 
            array (
                'id' => 42,
                'user_id' => 3,
                'type' => 'gold',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            42 => 
            array (
                'id' => 43,
                'user_id' => 3,
                'type' => 'ticket',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            43 => 
            array (
                'id' => 44,
                'user_id' => 3,
                'type' => 'giftbox',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            44 => 
            array (
                'id' => 45,
                'user_id' => 3,
                'type' => 'chest_silver',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            45 => 
            array (
                'id' => 46,
                'user_id' => 3,
                'type' => 'chest_gold',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            46 => 
            array (
                'id' => 47,
                'user_id' => 3,
                'type' => 'chest_diamond',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            47 => 
            array (
                'id' => 48,
                'user_id' => 3,
                'type' => 'scratch_box',
                'amount' => 0,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
        ));
        
        
    }
}