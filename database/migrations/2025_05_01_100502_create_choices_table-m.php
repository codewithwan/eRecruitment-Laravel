<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('choices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('question_id');
            $table->string('question', 255); // ← ini sebenarnya lebih tepat disebut 'choice'
            $table->boolean('is_correct')->default(false);
            $table->timestamps();

            // Foreign key
            $table->foreign('question_id')->references('id')->on('questions')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('choices');
    }
};
