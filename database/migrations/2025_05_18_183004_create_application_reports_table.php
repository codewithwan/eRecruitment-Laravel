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
        Schema::create('application_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->onDelete('cascade');
            
            // Final decision and reporting
            $table->decimal('overall_score', 5, 2)->nullable(); // Calculated from all stages
            $table->text('final_notes')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('recommendation')->nullable(); // HR recommendation
            $table->enum('final_decision', ['pending', 'accepted', 'rejected'])->default('pending');
            
            // Decision makers
            $table->foreignId('decision_made_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('decision_made_at')->nullable();
            $table->foreignId('report_generated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('report_generated_at')->nullable();
            
            // Detailed scores from each stage
            $table->decimal('administration_score', 5, 2)->nullable();
            $table->decimal('assessment_score', 5, 2)->nullable();
            $table->decimal('interview_score', 5, 2)->nullable();
            
            // Additional reporting data
            $table->json('stage_summary')->nullable(); // Summary of each stage
            $table->json('strengths')->nullable(); // Candidate strengths
            $table->json('weaknesses')->nullable(); // Areas for improvement
            $table->text('next_steps')->nullable(); // If accepted, what's next
            
            $table->timestamps();
            
            // Ensure one report record per application
            $table->unique('application_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_reports');
    }
}; 