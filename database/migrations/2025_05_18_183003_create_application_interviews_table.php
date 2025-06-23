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
        Schema::create('application_interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->onDelete('cascade');
            
            // Interview fields
            $table->decimal('score', 5, 2)->nullable();
            $table->text('notes')->nullable();
            $table->text('feedback')->nullable(); // Detailed interview feedback
            $table->json('evaluation_criteria')->nullable(); // Technical skills, communication, etc.
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'failed'])->default('scheduled');
            
            // Interview scheduling
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->foreignId('interviewer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('scheduled_by')->nullable()->constrained('users')->onDelete('set null');
            
            // Interview configuration
            $table->boolean('is_online')->default(true);
            $table->string('location')->nullable(); // meeting link or physical location
            $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('set null');
            $table->boolean('attendance_confirmed')->default(false);
            $table->string('interview_type')->nullable(); // technical, hr, final, etc.
            
            $table->timestamps();
            
            // Ensure one interview record per application
            $table->unique('application_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_interviews');
    }
}; 