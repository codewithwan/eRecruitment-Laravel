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
            // Drop the old foreign key constraint
            $table->dropForeign(['vacancy_id']);
            
            // Add the new constraint pointing to the 'vacancy' table
            $table->foreign('vacancy_id')->references('id')->on('vacancy')->onDelete('cascade');
        });
        
        // Do the same for any other tables that have foreign keys to vacancies
        if (Schema::hasTable('candidates') && Schema::hasColumn('candidates', 'vacancy_id')) {
            Schema::table('candidates', function (Blueprint $table) {
                if (DB::getSchemaBuilder()->getColumnListing('candidates')) {
                    try {
                        $table->dropForeign(['vacancy_id']);
                    } catch (\Exception $e) {
                        // Foreign key might not exist
                    }
                    $table->foreign('vacancy_id')->references('id')->on('vacancy')->onDelete('cascade');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('administrations', function (Blueprint $table) {
            $table->dropForeign(['vacancy_id']);
            $table->foreign('vacancy_id')->references('id')->on('vacancies')->onDelete('cascade');
        });
        
        if (Schema::hasTable('candidates') && Schema::hasColumn('candidates', 'vacancy_id')) {
            Schema::table('candidates', function (Blueprint $table) {
                try {
                    $table->dropForeign(['vacancy_id']);
                } catch (\Exception $e) {
                    // Foreign key might not exist
                }
                $table->foreign('vacancy_id')->references('id')->on('vacancies')->onDelete('cascade');
            });
        }
    }
};
