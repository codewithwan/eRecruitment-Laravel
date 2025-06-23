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
        Schema::create('application_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->onDelete('cascade');
            
            // Test scheduling
            $table->timestamp('test_scheduled_at')->nullable();
            $table->string('test_type')->nullable(); // Simpan sebagai string untuk fleksibilitas
            $table->foreignId('test_scheduled_by')->nullable()->constrained('users')->onDelete('set null');
            
            // Interview scheduling
            $table->timestamp('interview_scheduled_at')->nullable();
            $table->string('interview_location')->nullable();
            $table->boolean('is_interview_online')->default(true);
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('set null'); // For offline interviews
            $table->foreignId('interview_scheduled_by')->nullable()->constrained('users')->onDelete('set null');
            
            // Status tracking
            $table->boolean('test_attendance_confirmed')->default(false);
            $table->boolean('interview_attendance_confirmed')->default(false);
            
            $table->timestamps();
            
            // Add indexes for performance
            $table->index(['test_scheduled_at']);
            $table->index(['interview_scheduled_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_schedules');
    }
}; 