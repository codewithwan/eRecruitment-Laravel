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
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('vacancy_period_id')->constrained('vacancy_periods')->onDelete('cascade');
            $table->foreignId('status_id')->constrained()->onDelete('cascade');
            $table->json('application_data')->nullable();
            $table->json('test_results')->nullable();
            $table->json('interview_notes')->nullable();
            $table->timestamp('applied_at');
            $table->timestamps();
            
            // Create a unique constraint to prevent duplicate applications
            $table->unique(['user_id', 'vacancy_period_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicants');
    }
};
