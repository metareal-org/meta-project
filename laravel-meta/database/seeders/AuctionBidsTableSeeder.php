<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class AuctionBidsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('auction_bids')->delete();
        
        
        
    }
}