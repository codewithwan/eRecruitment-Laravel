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
        Schema::create('candidates_educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('education_level_id')->constrained('education_levels');
            $table->string('faculty');
            $table->foreignId('major_id')->constrained('master_majors');
            $table->string('institution_name');
            $table->decimal('gpa', 3, 2);
            $table->year('year_in');
            $table->year('year_out')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidates_educations');
    }
};
