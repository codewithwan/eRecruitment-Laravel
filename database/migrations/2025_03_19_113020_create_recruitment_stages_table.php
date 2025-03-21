<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\RecruitmentStageStatus;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('recruitment_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('stage_name'); 
            $table->enum('status', RecruitmentStageStatus::values())->default(RecruitmentStageStatus::SCHEDULED->value);
            $table->dateTime('scheduled_at')->nullable(); 
            $table->integer('duration')->nullable(); 
            $table->string('test_type')->nullable(); 
            $table->string('location')->nullable(); 
            $table->text('notes')->nullable(); 
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('recruitment_stages');
    }
};
