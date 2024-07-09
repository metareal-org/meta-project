<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lands', function (Blueprint $table) {
            $table->id();
            $table->string('full_id')->nullable();
            $table->string('region')->nullable();
            $table->string('zone')->nullable();
            $table->json('coordinates')->nullable();
            $table->json('center_point')->nullable();
            $table->integer('size')->nullable();
            $table->integer('owner_id')->nullable()->default(0);
            $table->integer('fixed_price')->nullable()->default(0);
            $table->boolean('is_for_sale')->nullable()->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lands');
    }
};
