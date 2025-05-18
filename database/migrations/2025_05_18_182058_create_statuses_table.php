<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Enums\CandidatesStage;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('description')->nullable();
            $table->enum('stage', CandidatesStage::values());
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert default statuses
        $this->seedStatuses();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('statuses');
    }

    /**
     * Seed the initial status values
     */
    private function seedStatuses(): void
    {
        $statuses = [
            [
                'name' => 'Administrative Selection',
                'code' => 'admin_selection',
                'description' => 'Candidate is in administrative selection stage',
                'stage' => CandidatesStage::ADMINISTRATIVE_SELECTION->value,
                'is_active' => true,
            ],
            [
                'name' => 'Psychological Test',
                'code' => 'psychotest',
                'description' => 'Candidate is taking psychological test',
                'stage' => CandidatesStage::PSYCHOTEST->value,
                'is_active' => true,
            ],
            [
                'name' => 'Interview',
                'code' => 'interview',
                'description' => 'Candidate is in interview stage',
                'stage' => CandidatesStage::INTERVIEW->value,
                'is_active' => true,
            ],
            [
                'name' => 'Accepted',
                'code' => 'accepted',
                'description' => 'Candidate has been accepted',
                'stage' => CandidatesStage::ACCEPTED->value,
                'is_active' => true,
            ],
            [
                'name' => 'Rejected',
                'code' => 'rejected',
                'description' => 'Candidate has been rejected',
                'stage' => CandidatesStage::REJECTED->value,
                'is_active' => true,
            ],
        ];

        foreach ($statuses as $status) {
            DB::table('statuses')->insert($status);
        }
    }
};
