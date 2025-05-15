<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('about_us', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade'); // relasi ke tabel companies
            $table->text('vision');    
            $table->text('mission');   
            $table->timestamps();      
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_us');
    }
};
