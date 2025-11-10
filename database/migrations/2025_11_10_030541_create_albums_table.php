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
        Schema::create('albums', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['album', 'ep', 'single']);
            $table->date('release_date');
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('spotify_url')->nullable();
            $table->string('bandcamp_url')->nullable();
            $table->string('apple_music_url')->nullable();
            $table->boolean('featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('albums');
    }
};
