<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

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
            $table->string('stage');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert default statuses and stages
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
     * Seed the initial status and stage values
     */
    private function seedStatuses(): void
    {
        $data = [
            [
                'name' => 'Administrative Selection',
                'code' => 'admin_selection',
                'description' => 'Candidate is in administrative selection stage',
                'stage' => 'administrative_selection',
                'is_active' => true,
            ],
            [
                'name' => 'Psychological Test',
                'code' => 'psychotest',
                'description' => 'Candidate is taking psychological test',
                'stage' => 'psychological_test',
                'is_active' => true,
            ],
            [
                'name' => 'Interview',
                'code' => 'interview',
                'description' => 'Candidate is in interview stage',
                'stage' => 'interview',
                'is_active' => true,
            ],
            [
                'name' => 'Accepted',
                'code' => 'accepted',
                'description' => 'Candidate has been accepted',
                'stage' => 'accepted',
                'is_active' => true,
            ],
            [
                'name' => 'Rejected',
                'code' => 'rejected',
                'description' => 'Candidate has been rejected',
                'stage' => 'rejected',
                'is_active' => true,
            ],
        ];

        foreach ($data as $item) {
            DB::table('statuses')->insert($item);
        }
    }
};
