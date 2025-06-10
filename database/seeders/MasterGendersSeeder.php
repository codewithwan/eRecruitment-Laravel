<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterGendersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('master_genders')->updateOrInsert(['id' => 1], ['name' => 'male']);
        DB::table('master_genders')->updateOrInsert(['id' => 2], ['name' => 'female']);
    }
}
