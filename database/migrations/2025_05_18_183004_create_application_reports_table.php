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
            $table->decimal('overall_score', 5, 2)->nullable();
            $table->text('final_notes')->nullable();
            $table->enum('final_decision', ['pending', 'accepted', 'rejected'])->default('pending');
            
            // Decision maker
            $table->foreignId('decision_made_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('decision_made_at')->nullable();
            
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