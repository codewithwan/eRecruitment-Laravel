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
        Schema::table('administrations', function (Blueprint $table) {
            if (Schema::hasColumn('administrations', 'status')) {
                $table->dropColumn('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('administrations', function (Blueprint $table) {
            if (!Schema::hasColumn('administrations', 'status')) {
                $table->enum('status', ['pending', 'reviewing', 'accepted', 'rejected'])->default('pending');
            }
        });
    }
};
