<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class JobTypesTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('job_types')->delete();

        DB::table('job_types')->insert([
            [
                'id' => 1,
                'name' => 'Full Time',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 2,
                'name' => 'Internship',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
