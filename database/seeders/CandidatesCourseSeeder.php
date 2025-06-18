<?php

namespace Database\Seeders;

use App\Models\CandidatesCourse;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CandidatesCourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all candidate users
        $candidates = User::where('role', UserRole::CANDIDATE)->get();

        if ($candidates->isEmpty()) {
            $this->command->info('No candidates found. Please run UserSeeder first.');
            return;
        }

        $courses = [
            // Programming & IT
            'Full Stack Web Development - Dicoding Indonesia',
            'Data Science dengan Python - BuildWithAngga',
            'Mobile App Development Flutter - Sanbercode',
            'AWS Cloud Practitioner - AWS Training',
            'Google Analytics 4 - Google Skillshop',

            // Business & Management
            'Digital Marketing Strategy - Skill Academy by Ruangguru',
            'Project Management Professional - PMI Indonesia',
            'Social Media Marketing - Coursera Indonesia',
            'Financial Management - Prakerja Pijar Mahir',

            // Design & Creative
            'UI/UX Design Fundamentals - Eudeka Indonesia',
            'Graphic Design Professional - IDS Education',
            'Video Editing & Motion Graphics - Belajar Lagi',

            // Language & Communication
            'Business English Communication - EF English First',
            'Public Speaking & Presentation - Dale Carnegie Indonesia',

            // Industry Specific
            'Human Resources Management - PPSM Indonesia',
            'Supply Chain Management - Universitas Terbuka',
        ];

        foreach ($candidates as $candidate) {
            // Each candidate gets 1-4 random courses
            $selectedCourses = fake()->randomElements($courses, fake()->numberBetween(1, 4));
            
            foreach ($selectedCourses as $courseName) {
                CandidatesCourse::create([
                    'user_id' => $candidate->id,
                    'course_name' => $courseName,
                    'certificate_file' => fake()->optional(0.8)->passthrough("course_cert_" . $candidate->id . "_" . fake()->randomNumber(3) . ".pdf"),
                ]);
            }
        }

        $this->command->info('Candidates courses seeded successfully.');
    }
} 