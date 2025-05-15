<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('statuses_id', function (Blueprint $table) {
            $table->id(); // Creates an auto-incrementing INT primary key named 'id'
            $table->string('name'); // Creates a VARCHAR column named 'name'
            $table->timestamps(); // Adds created_at and updated_at columns
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('statuses_id');
    }
};
