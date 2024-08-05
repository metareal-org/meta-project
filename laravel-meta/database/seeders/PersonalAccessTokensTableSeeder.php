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
                'id' => 1,
                'tokenable_type' => 'App\\Models\\User',
                'tokenable_id' => 2,
                'name' => 'auth_token',
                'token' => '3c9ab6af69ec4890751f93444fd154ab979dbda60002af67846f7b0ed6ddf1dd',
                'abilities' => '["*"]',
                'last_used_at' => '2024-08-04 23:24:01',
                'expires_at' => '2024-08-05 21:32:24',
                'created_at' => '2024-08-04 21:32:24',
                'updated_at' => '2024-08-04 23:24:01',
            ),
        ));
        
        
    }
}