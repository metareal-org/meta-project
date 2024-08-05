<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PersonalAccessTokensTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        \DB::table('personal_access_tokens')->delete();
        
        \DB::table('personal_access_tokens')->insert(array (
            0 => 
            array (
                'id' => 2,
                'tokenable_type' => 'App\\Models\\User',
                'tokenable_id' => 2,
                'name' => 'auth_token',
                'token' => '8dc1c5774df0adc7d9863b23131a231a70d3142c0c24c799e905a67763797a8f',
                'abilities' => '["*"]',
                'last_used_at' => '2024-08-04 23:24:01',
                'expires_at' => '2024-08-05 21:32:24',
                'created_at' => '2024-08-04 21:32:24',
                'updated_at' => '2024-08-04 23:24:01',
            ),
        ));
        
        
    }
}