<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            // Hapus kolom string lama
            if (Schema::hasColumn('vacancies', 'department')) {
                $table->dropColumn('department');
            }

            // Tambahkan foreign key baru
            $table->foreignId('department_id')
                  ->nullable()
                  ->constrained()
                  ->onDelete('cascade')
                  ->after('job_type_id'); // sesuaikan posisi
        });
    }

    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            // Hapus foreign key baru
            $table->dropForeign(['department_id']);
            $table->dropColumn('department_id');

            // Tambahkan kembali kolom lama jika perlu
            $table->string('department')->after('job_type_id');
        });
    }
};
