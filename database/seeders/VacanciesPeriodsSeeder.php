<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VacanciesPeriodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('vacancies_periods')->updateOrInsert(
            ['id' => 1],
            ['period_id' => 1, 'vacancy_id' => 1]
        );
        DB::table('vacancies_periods')->updateOrInsert(
            ['id' => 2],
            ['period_id' => 3, 'vacancy_id' => 1]
        );
        DB::table('vacancies_periods')->updateOrInsert(
            ['id' => 3],
            ['period_id' => 2, 'vacancy_id' => 2]
        );
        DB::table('vacancies_periods')->updateOrInsert(
            ['id' => 4],
            ['period_id' => 3, 'vacancy_id' => 3]
        );
        DB::table('vacancies_periods')->updateOrInsert(
            ['id' => 5],
            ['period_id' => 3, 'vacancy_id' => 4]
        );
        DB::table('vacancies_periods')->updateOrInsert(
            ['id' => 6],
            ['period_id' => 4, 'vacancy_id' => 5]
        );
        DB::table('vacancies_periods')->updateOrInsert(
            ['id' => 7],
            ['period_id' => 4, 'vacancy_id' => 7]
        );
        DB::table('vacancies_periods')->updateOrInsert(
            ['id' => 8],
            ['period_id' => 2, 'vacancy_id' => 8]
        );
    }
}
