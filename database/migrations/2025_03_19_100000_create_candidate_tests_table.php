<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Make sure the candidates table exists first
        if (!Schema::hasTable('candidates')) {
            throw new \Exception('The candidates table must be created before the candidate_tests table.');
        }
        
        Schema::create('candidate_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->string('test_type');
            $table->string('status')->default('scheduled'); // scheduled, in_progress, completed, expired
            $table->dateTime('scheduled_date');
            $table->dateTime('start_time')->nullable();
            $table->dateTime('end_time')->nullable();
            $table->string('duration');
            $table->decimal('score', 5, 2)->nullable();
            $table->text('instructions')->nullable();
            $table->timestamps();
        });

        Schema::create('candidate_test_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_test_id')->constrained()->onDelete('cascade');
            $table->foreignId('question_id')->constrained()->onDelete('cascade');
            $table->string('answer')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidate_test_questions');
        Schema::dropIfExists('candidate_tests');
    }
};
