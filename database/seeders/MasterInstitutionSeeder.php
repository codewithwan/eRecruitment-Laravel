<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterInstitutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('master_institutions')->insert([
            [
                'name' => 'Universitas Diponegoro',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Universitas Negeri Semarang',

                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Universitas Katolik Soegijapranata',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Politeknik Negeri Semarang',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Politeknik Maritim Negeri Semarang',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
