<?php

namespace Database\Seeders;

use App\Models\Assessment;
use Illuminate\Database\Seeder;

class AssessmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $assessments = [
            [
                'title' => 'Basic Technical Assessment',
                'description' => 'Assessment for evaluating basic technical skills',
                'test_type' => 'technical',
                'duration' => 60,
            ],
            [
                'title' => 'Psychological Assessment',
                'description' => 'Assessment for evaluating psychological aptitude',
                'test_type' => 'psychological',
                'duration' => 45,
            ],
            [
                'title' => 'General Knowledge Assessment',
                'description' => 'Assessment for evaluating general knowledge',
                'test_type' => 'general',
                'duration' => 30,
            ],
        ];

        foreach ($assessments as $assessmentData) {
            Assessment::create($assessmentData);
        }
    }
}