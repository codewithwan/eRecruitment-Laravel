<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AssessmentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('assessments')->insert([
            [
                'id' => 1,
                'title' => 'Tes Kemampuan Logika',
                'description' => 'Tes untuk mengukur kemampuan logika dan pemecahan masalah kandidat',
                'test_type' => 'multiple_choice',
                'duration' => '60 menit',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 2,
                'title' => 'Tes Bahasa Inggris',
                'description' => 'Tes untuk mengukur kemampuan bahasa Inggris kandidat',
                'test_type' => 'essay',
                'duration' => '45 menit',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 3,
                'title' => 'Tes Kemampuan Teknis Programmer',
                'description' => 'Tes untuk mengukur kemampuan teknis dalam bidang programming',
                'test_type' => 'practical',
                'duration' => '90 menit',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 4,
                'title' => 'Tes Kepribadian',
                'description' => 'Tes untuk menganalisis kepribadian dan kesesuaian dengan budaya perusahaan',
                'test_type' => 'questionnaire',
                'duration' => '30 menit',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 5,
                'title' => 'Tes Kemampuan Analitis',
                'description' => 'Tes untuk mengukur kemampuan analisis dan pengambilan keputusan kandidat',
                'test_type' => 'case_study',
                'duration' => '75 menit',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ]);
    }
}
