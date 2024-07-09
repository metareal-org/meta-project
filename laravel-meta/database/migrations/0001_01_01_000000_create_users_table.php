<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('address')->unique();
            $table->string('nickname')->nullable();
            $table->string('avatar_url')->nullable();
            $table->integer('cp_amount_free')->default(0);
            $table->integer('cp_amount_locked')->default(0);
            $table->integer('meta_amount_free')->default(0);
            $table->integer('meta_amount_locked')->default(0);
            $table->json('coordinates')->nullable();
            $table->integer('current_mission')->default(0);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};