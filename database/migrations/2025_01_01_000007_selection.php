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
         Schema::create('selection', function (Blueprint $table) {
            $table->id(); // Creates an auto-incrementing INT primary key named 'id'
            $table->string('name'); // Creates a VARCHAR column named 'name'
            $table->string('description')->nullable(); // Description for the selection stage
            $table->timestamps(); // Adds created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('selection');
    }
};
