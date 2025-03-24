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
        Schema::create('psychometric_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained('candidates')->onDelete('cascade');
            $table->foreignId('assessment_id')->constrained('assessments')->onDelete('cascade');
            $table->dateTime('scheduled_date');
            $table->enum('status', ['pending', 'ongoing', 'completed'])->default('pending');
            $table->boolean('notification_sent')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('psychometric_assignments');
    }
};
