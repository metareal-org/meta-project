<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCurrenciesTable extends Migration
{
    public function up()
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->enum('type', ['cp', 'meta', 'bnb']);
            $table->unsignedBigInteger('amount')->default(0);
            $table->unsignedBigInteger('locked_amount')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'type']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('currencies');
    }
}