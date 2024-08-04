<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->enum('type', ['cp', 'cp_locked', 'meta', 'meta_locked', 'bnb', 'bnb_locked', 'iron', 'wood', 'sand', 'gold', 'giftbox', 'ticket', 'chest_silver', 'chest_gold', 'chest_diamond', 'scratch_box']);
            $table->unsignedBigInteger('amount');
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
