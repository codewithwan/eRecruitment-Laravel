<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ApplicationHistorySeeder extends Seeder
{
    public function run(): void
    {
        // Get necessary data
        $applications = DB::table('applications')->take(3)->get();
        $selections = DB::table('selection')->get();
        $assessments = DB::table('assessments')->get();
        $interviews = DB::table('interviews')->get();
        $users = DB::table('users')->where('role', 'hr')->orWhere('role', 'Admin')->get();
        $statuses = DB::table('statuses')->get();

        // Check if we have the required data
        if ($applications->count() < 3 || $selections->count() < 1 ||
            $assessments->count() < 2 || $interviews->count() < 1 ||
            $users->count() < 1 || $statuses->count() < 1) {
            echo "Data tidak cukup untuk seeding application history.\n";
            echo "Applications: " . $applications->count() . " (need 3)\n";
            echo "Selections: " . $selections->count() . " (need 1)\n";
            echo "Assessments: " . $assessments->count() . " (need 2)\n";
            echo "Interviews: " . $interviews->count() . " (need 1)\n";
            echo "Users (HR/Admin): " . $users->count() . " (need 1)\n";
            echo "Statuses: " . $statuses->count() . " (need 1)\n";
            return;
        }
        

        // Find selection IDs by name
        $administrationId = $selections->where('name', 'Administrasi')->first()->id ?? 1;
        $psikotestId = $selections->where('name', 'Psikotest')->first()->id ?? 2;
        $wawancaraId = $selections->where('name', 'Wawancara')->first()->id ?? 3;

        // Find status IDs
        $pendingStatusId = $statuses->where('name', 'Pending')->first()->id ?? 1;
        $inProgressStatusId = $statuses->where('name', 'In Progress')->first()->id ?? 2;
        $completedStatusId = $statuses->where('name', 'Completed')->first()->id ?? 3;

        // Reviewer ID (HR personnel)
        $reviewerId = $users->first()->id ?? 1;

        // Application 1: Complete flow through all stages
        DB::table('application_history')->insert([
            // Administration stage (completed & qualified)
            [
                'application_id' => $applications[0]->id,
                'selection_id' => $administrationId,
                'assessments_id' => null,
                'interviews_id' => null,
                'reviewed_by' => $reviewerId,
                'statuses_id' => $completedStatusId,
                'is_qualified' => true,
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(9),
            ],
            // Psikotest stage (completed & qualified)
            [
                'application_id' => $applications[0]->id,
                'selection_id' => $psikotestId,
                'assessments_id' => $assessments[0]->id,
                'interviews_id' => null,
                'reviewed_by' => $reviewerId,
                'statuses_id' => $completedStatusId,
                'is_qualified' => true,
                'created_at' => Carbon::now()->subDays(8),
                'updated_at' => Carbon::now()->subDays(6),
            ],
            // Wawancara stage (in progress)
            [
                'application_id' => $applications[0]->id,
                'selection_id' => $wawancaraId,
                'assessments_id' => null,
                'interviews_id' => $interviews[0]->id,
                'reviewed_by' => $reviewerId,
                'statuses_id' => $inProgressStatusId,
                'is_qualified' => null, // pending result
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],
        ]);

        // Application 2: Failed at psikotest stage
        DB::table('application_history')->insert([
            // Administration stage (completed & qualified)
            [
                'application_id' => $applications[1]->id,
                'selection_id' => $administrationId,
                'assessments_id' => null,
                'interviews_id' => null,
                'reviewed_by' => $reviewerId,
                'statuses_id' => $completedStatusId,
                'is_qualified' => true,
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(8),
            ],
            // Psikotest stage (completed & not qualified)
            [
                'application_id' => $applications[1]->id,
                'selection_id' => $psikotestId,
                'assessments_id' => $assessments[1]->id,
                'interviews_id' => null,
                'reviewed_by' => $reviewerId,
                'statuses_id' => $completedStatusId,
                'is_qualified' => false,
                'created_at' => Carbon::now()->subDays(7),
                'updated_at' => Carbon::now()->subDays(6),
            ]
        ]);

        // Application 3: Still in administration stage
        DB::table('application_history')->insert([
            [
                'application_id' => $applications[2]->id,
                'selection_id' => $administrationId,
                'assessments_id' => null,
                'interviews_id' => null,
                'reviewed_by' => null, // not yet reviewed
                'statuses_id' => $pendingStatusId,
                'is_qualified' => null, // pending review
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ]
        ]);
    }
}
