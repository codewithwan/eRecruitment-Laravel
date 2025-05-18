<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicationStatusesTable extends Migration
{
    public function up()
    {
        Schema::create('applications_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('applications')->onDelete('cascade');
            $table->timestamp('changed_at')->nullable();
            $table->integer('changed_by')->nullable();
            $table->foreignId('status_id')->constrained('statuses_id')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('applications_statuses');
    }
}