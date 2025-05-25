<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InterviewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if required data exists
        $applicationsCount = DB::table('applications')->count();
        $users = DB::table('users')->where('role', 'hr')
                    ->orWhere('role', 'hr')
                    ->orWhere('role', 'interviewer')
                    ->orWhere('role', 'Admin')
                    ->get();

        echo "Applications: $applicationsCount\n";
        echo "Users (HR/Admin/interviewer): " . $users->count() . "\n";

        if ($applicationsCount < 1 || $users->count() < 1) {
            echo "Not enough data to seed interviews. Need at least 1 application and 1 HR/Admin user.\n";
            return;
        }

        // Get required IDs
        $applications = DB::table('applications')->take($applicationsCount)->get();
        $interviewer = $users->first();

        // Create realistic data based on what we have
        $data = [];

        // First application - completed interview
        $data[] = [
            'application_id' => $applications[0]->id,
            'scheduled_at' => Carbon::now()->addDays(2)->setHour(10)->setMinute(0),
            'interviewer_id' => $interviewer->id,
            'result' => 'Kandidat menunjukkan kemampuan komunikasi yang baik dan pengetahuan teknis yang memadai.',
            'created_at' => Carbon::now()->subDays(2),
            'updated_at' => Carbon::now()->subDays(1),
        ];

        // Second application if exists
        if ($applications->count() > 1) {
            $data[] = [
                'application_id' => $applications[1]->id,
                'scheduled_at' => Carbon::now()->addDays(2)->setHour(13)->setMinute(30),
                'interviewer_id' => $interviewer->id,
                'result' => 'Kandidat perlu meningkatkan pemahaman teknis terkait posisi yang dilamar.',
                'created_at' => Carbon::now()->subDays(2),
                'updated_at' => Carbon::now()->subDays(1),
            ];
        }

        // Insert the data
        DB::table('interviews')->insert($data);

        echo "Successfully added " . count($data) . " interview records.\n";
    }
}
