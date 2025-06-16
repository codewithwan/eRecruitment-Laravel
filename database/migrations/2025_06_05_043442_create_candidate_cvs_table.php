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
        Schema::create('candidate_cvs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('cv_filename'); // Nama file CV yang tersimpan
            $table->string('cv_path'); // Path file CV
            $table->integer('download_count')->default(0); // Berapa kali didownload
            $table->timestamp('last_downloaded_at')->nullable(); // Kapan terakhir didownload
            $table->longText('cv_data_snapshot')->nullable(); // Ubah dari json ke longText
            $table->boolean('is_active')->default(true); // CV aktif atau tidak
            $table->timestamps();
            
            $table->index(['user_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidate_cvs');
    }
};
