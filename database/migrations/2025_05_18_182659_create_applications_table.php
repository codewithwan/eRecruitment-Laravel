<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\ApplicationStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('vacancy_period_id')->constrained('vacancy_periods')->onDelete('cascade');
            $table->foreignId('status_id')->constrained('statuses')->onDelete('restrict');
            $table->foreignId('current_stage_id')->constrained('statuses')->onDelete('restrict');
            
            // Tetap menyimpan enum untuk kompatibilitas
            $table->enum('current_stage', ApplicationStatus::values())->default(ApplicationStatus::ADMINISTRATIVE_SELECTION->value);
            
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
        Schema::dropIfExists('applications');
    }
};
