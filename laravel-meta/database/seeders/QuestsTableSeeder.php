<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class QuestsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('quests')->delete();
        
        \DB::table('quests')->insert(array (
            0 => 
            array (
                'id' => 1,
                'title' => 'trade_gems_with_ticket',
                'description' => 'Trade your gems to receive a ticket and gold.',
                'rewards' => '[{"type": "ticket", "amount": 1}]',
                'costs' => NULL,
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            1 => 
            array (
                'id' => 2,
                'title' => 'trade_ticket_with_giftbox',
                'description' => 'Trade your tickets to receive a giftbox.',
                'rewards' => '[{"type": "giftbox", "amount": 1}]',
                'costs' => '[{"type": "ticket", "amount": 1}]',
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
            2 => 
            array (
                'id' => 3,
                'title' => 'trade_giftbox_with_rewards',
                'description' => 'Trade your giftboxes to receive some rewards.',
                'rewards' => '[{"type": "cp", "amount": 5000}, {"type": "wood", "amount": 100}, {"type": "sand", "amount": 30}]',
                'costs' => '[{"type": "giftbox", "amount": 1}]',
                'created_at' => '2024-08-04 16:41:51',
                'updated_at' => '2024-08-04 16:41:51',
            ),
        ));
        
        
    }
}