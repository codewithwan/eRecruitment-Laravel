<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCandidatesProfilesTable extends Migration
{
    public function up()
    {
        Schema::create('candidates_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('no_ektp', 16);
            $table->foreignId('gender_id')->constrained('master_genders'); // ubah dari enum gender ke foreign key
            $table->string('phone_number');
            $table->string('npwp')->nullable();
            $table->text('about_me');
            $table->string('place_of_birth');
            $table->date('date_of_birth');
            $table->text('address');
            $table->string('province');
            $table->string('city');
            $table->string('district');
            $table->string('village');
            $table->string('rt');
            $table->string('rw');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('candidates_profiles');
    }
}
