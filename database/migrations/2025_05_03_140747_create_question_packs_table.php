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
        Schema::create('question_packs', function (Blueprint $table) {
            $table->id();
            $table->string('pack_name');
            $table->text('description')->nullable();
            $table->string('test_type');
            $table->integer('duration'); // In minutes
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_packs');
    }
};
