<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Applicant;
use App\Models\Status;
use App\Models\User;
use App\Models\VacancyPeriod;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ApplicantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {        // Get the Administrative Selection status from existing statuses
        $status = Status::where('code', 'admin_selection')->first();
        
        if (!$status) {
            $this->command->error('Status for Administrative Selection not found. Make sure statuses are properly seeded.');
            return;
        }        // Get candidate users
        $candidateUsers = User::where('role', UserRole::CANDIDATE->value)->get();
        
        if ($candidateUsers->isEmpty()) {
            $this->command->info('No candidate users found. Creating some candidate users first.');
            // Create some candidate users
            $candidateUsers = User::factory(5)->create([
                'role' => UserRole::CANDIDATE->value
            ]);
        }
        
        // Get vacancy-period relationships
        $vacancyPeriods = VacancyPeriod::all();
        
        if ($vacancyPeriods->isEmpty()) {
            $this->command->info('No vacancy-period relationships found. Make sure to run VacanciesSeeder and PeriodSeeder first.');
            return;
        }
        
        // Create some test applicants
        foreach ($candidateUsers as $index => $user) {
            // Pick random vacancy-periods to apply to (up to 2)
            $randomVacancyPeriods = $vacancyPeriods->random(min(2, $vacancyPeriods->count()));
            
            foreach ($randomVacancyPeriods as $vacancyPeriod) {
                // Only create if not already exists
                $exists = Applicant::where('user_id', $user->id)
                    ->where('vacancy_period_id', $vacancyPeriod->id)
                    ->exists();
                    
                if (!$exists) {
                    Applicant::create([
                        'user_id' => $user->id,
                        'vacancy_period_id' => $vacancyPeriod->id,
                        'status_id' => $status->id,
                        'application_data' => json_encode([
                            'education' => 'Bachelor\'s Degree',
                            'skills' => ['Communication', 'Teamwork', 'Problem Solving'],
                            'experience' => '2 years'
                        ]),
                        'applied_at' => Carbon::now()->subDays(rand(1, 30)),
                    ]);
                }
            }
        }
        
        $this->command->info('Applicant seeder completed successfully.');
    }
}
