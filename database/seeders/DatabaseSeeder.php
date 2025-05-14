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
            SuperAdminSeeder::class,
            DepartmentsTableSeeder::class,
            CandidateSeeder::class,
            CandidateProfileSeeder::class,
            CompaniesTableSeeder::class,
            JobTypesTableSeeder::class,
            VacanciesSeeder::class,
            // VacanciesTableSeeder::class,



        ]);
    }
}
