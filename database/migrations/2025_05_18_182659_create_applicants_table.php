<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\CandidatesStage;

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
            
            // Current stage tracking
            $table->enum('current_stage', CandidatesStage::values())->default(CandidatesStage::ADMINISTRATIVE_SELECTION->value);
            $table->timestamp('applied_at');
            
            // Administrative Selection
            $table->decimal('admin_score', 5, 2)->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamp('admin_reviewed_at')->nullable();
            $table->foreignId('admin_reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            
            // Assessment/Psychotest
            $table->decimal('test_score', 5, 2)->nullable();
            $table->text('test_notes')->nullable();
            $table->timestamp('test_scheduled_at')->nullable();
            $table->timestamp('test_completed_at')->nullable();
            
            // Interview
            $table->decimal('interview_score', 5, 2)->nullable();
            $table->text('interview_notes')->nullable();
            $table->timestamp('interview_scheduled_at')->nullable();
            $table->timestamp('interview_completed_at')->nullable();
            $table->foreignId('interviewer_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Final decision
            $table->text('rejection_reason')->nullable();
            $table->timestamp('decision_made_at')->nullable();
            $table->foreignId('decision_made_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Create a unique constraint to prevent duplicate applications
            $table->unique(['user_id', 'vacancy_period_id']);
            
            // Add indexes for performance
            $table->index(['current_stage']);
            $table->index(['test_scheduled_at']);
            $table->index(['interview_scheduled_at']);
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
