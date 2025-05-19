<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CompaniesTableSeeder::class,
            DepartmentsTableSeeder::class,
            StatusesSeeder::class,
            JobTypesTableSeeder::class,
            VacanciesSeeder::class,         // <-- tambahkan ini jika ada seeder vacancies
            CandidateSeeder::class,
            CandidateProfileSeeder::class,
            ApplicationSeeder::class,
            ApplicationHistorySeeder::class,
        ]);
    }
}
