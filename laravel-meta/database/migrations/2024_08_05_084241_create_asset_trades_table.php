<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('asset_trades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users');
            $table->string('asset_type');
            $table->unsignedBigInteger('amount');
            $table->decimal('price', 18, 8);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('asset_trades');
    }
};