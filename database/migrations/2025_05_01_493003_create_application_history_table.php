<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationHistoryTable extends Migration
{
    public function up()
    {
        Schema::create('application_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->onDelete('cascade');
            $table->foreignId('selection_id')->nullable()->constrained('selection')->onDelete('set null');
            $table->foreignId('assessments_id')->nullable()->constrained('assessments')->onDelete('set null');
            $table->foreignId('interviews_id')->nullable()->constrained('interviews')->onDelete('set null');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->boolean('is_qualified')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('application_history');
    }
}
