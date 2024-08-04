<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('scratch_box_land', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scratch_box_id');
            $table->foreignId('land_id');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('scratch_box_land');
    }
};