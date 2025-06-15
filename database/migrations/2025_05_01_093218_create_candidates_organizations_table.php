<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCandidatesOrganizationsTable extends Migration
{
    public function up()
    {
        Schema::create('candidates_organizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('organization_name');
            $table->string('position');
            $table->string('start_month');  // Added start_month
            $table->year('start_year');
            $table->string('end_month')->nullable();  // Added end_month
            $table->year('end_year')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('candidates_organizations');
    }
}