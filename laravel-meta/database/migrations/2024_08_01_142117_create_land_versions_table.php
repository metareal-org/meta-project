<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('land_versions', function (Blueprint $table) {
            $table->id();
            $table->json('data');
            $table->string('file_name');
            $table->string('version_name');
            $table->boolean('is_active')->default(false);
            $table->boolean('is_locked')->default(false);
            $table->string('type')->default('normal');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('land_versions');
    }
};