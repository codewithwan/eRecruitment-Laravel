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
        Schema::create('application_evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->onDelete('cascade');
            
            // Administrative Selection
            $table->decimal('admin_score', 5, 2)->nullable();
            $table->text('admin_notes')->nullable();
            $table->foreignId('admin_reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('admin_reviewed_at')->nullable();
            
            // Assessment/Psychotest
            $table->decimal('test_score', 5, 2)->nullable();
            $table->text('test_notes')->nullable();
            $table->timestamp('test_completed_at')->nullable();
            
            // Interview
            $table->decimal('interview_score', 5, 2)->nullable();
            $table->text('interview_notes')->nullable();
            $table->timestamp('interview_completed_at')->nullable();
            $table->foreignId('interviewer_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Final decision
            $table->text('rejection_reason')->nullable();
            $table->timestamp('decision_made_at')->nullable();
            $table->foreignId('decision_made_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_evaluations');
    }
}; 