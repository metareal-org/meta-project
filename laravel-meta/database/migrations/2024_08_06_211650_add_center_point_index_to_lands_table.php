<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::statement('ALTER TABLE lands ADD INDEX idx_center_point ((cast(center_point->"$.latitude" as float)), (cast(center_point->"$.longitude" as float)))');
    }

    public function down()
    {
        Schema::table('lands', function (Blueprint $table) {
            $table->dropIndex('idx_center_point');
        });
    }
};