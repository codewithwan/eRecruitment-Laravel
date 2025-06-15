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
        Schema::create('candidates_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('no_ektp', 16);
            $table->string('gender', 10); 
            $table->string('phone_number');
            $table->string('npwp')->nullable();
            $table->text('about_me');
            $table->string('place_of_birth');
            $table->date('date_of_birth');
            $table->text('address');
            $table->string('province');
            $table->string('city');
            $table->string('district');
            $table->string('village');
            $table->string('rt');
            $table->string('rw');
            $table->string('profile_image')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidates_profiles');
    }
};
