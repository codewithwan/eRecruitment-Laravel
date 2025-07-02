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
        Schema::create('application_administrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->onDelete('cascade');
            
            // Administrative Selection fields
            $table->decimal('score', 5, 2)->nullable();
            $table->text('notes')->nullable();
            $table->text('documents_checked')->nullable(); // CV, documents verification
            $table->json('requirements_met')->nullable(); // Which requirements are met
            $table->enum('status', ['pending', 'passed', 'failed'])->default('pending');
            
            // Reviewer information
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            
            $table->timestamps();
            
            // Ensure one administration record per application
            $table->unique('application_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('application_administrations');
    }
}; 