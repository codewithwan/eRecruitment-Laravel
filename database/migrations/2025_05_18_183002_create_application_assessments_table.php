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
        Schema::create('application_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->onDelete('cascade');
            
            // Assessment/Psychotest fields
            $table->decimal('score', 5, 2)->nullable();
            $table->text('notes')->nullable();
            $table->string('test_type')->nullable(); // general, technical, leadership, etc.
            $table->json('test_results')->nullable(); // Detailed test results
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'failed'])->default('scheduled');
            
            // Test scheduling
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->foreignId('scheduled_by')->nullable()->constrained('users')->onDelete('set null');
            
            // Test configuration
            $table->boolean('attendance_confirmed')->default(false);
            $table->string('test_location')->nullable(); // online, office, etc.
            
            $table->timestamps();
            
            // Ensure one assessment record per application
            $table->unique('application_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_assessments');
    }
}; 