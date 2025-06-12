<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStatusesTable extends Migration
{
    public function up()
    {
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('color')->default('#6c757d');
            $table->timestamps();
        });
        
        // Tambahkan data default
        DB::table('statuses')->insert([
            ['name' => 'Applied', 'color' => '#f39c12', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Shortlisted', 'color' => '#3498db', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Interview', 'color' => '#9b59b6', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Accepted', 'color' => '#2ecc71', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Rejected', 'color' => '#e74c3c', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('statuses');
    }
}
