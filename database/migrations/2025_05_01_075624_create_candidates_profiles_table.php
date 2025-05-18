<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCandidatesProfilesTable extends Migration
{
    public function up()
    {
        Schema::create('candidate_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('no_ektp');
            $table->enum('gender', ['male', 'female'])->nullable(); // sesuaikan dengan enum sebenarnya
            $table->string('phone_number')->nullable();
            $table->string('npwp')->nullable();
            $table->text('about_me')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->text('address')->nullable();
            $table->string('province')->nullable();
            $table->string('city')->nullable();
            $table->string('district')->nullable();
            $table->string('village')->nullable();
            $table->string('rt')->nullable();
            $table->string('rw')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('candidate_profiles');
    }
}
