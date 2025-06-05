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
        DB::table('vacancies_periods')->insert([
            ['id' => 1, 'vacancy_id' => 1, 'period_id' => 1],
            ['id' => 2, 'vacancy_id' => 1, 'period_id' => 3],
            ['id' => 3, 'vacancy_id' => 2, 'period_id' => 2],
            ['id' => 4, 'vacancy_id' => 3, 'period_id' => 3],
            ['id' => 5, 'vacancy_id' => 4, 'period_id' => 3],
            ['id' => 6, 'vacancy_id' => 5, 'period_id' => 4],
            ['id' => 7, 'vacancy_id' => 7, 'period_id' => 4],
            ['id' => 8, 'vacancy_id' => 8, 'period_id' => 2],
        ]);
    }
}
