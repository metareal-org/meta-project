<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class ScratchBoxesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('scratch_boxes')->delete();
        
        \DB::table('scratch_boxes')->insert(array (
            0 => 
            array (
                'id' => 2,
                'name' => '1',
                'price' => 248914,
                'status' => 'available',
                'created_at' => '2024-08-04 17:45:51',
                'updated_at' => '2024-08-04 17:45:51',
            ),
            1 => 
            array (
                'id' => 3,
                'name' => '2',
                'price' => 172584,
                'status' => 'available',
                'created_at' => '2024-08-04 17:46:05',
                'updated_at' => '2024-08-04 17:46:05',
            ),
        ));
        
        
    }
}