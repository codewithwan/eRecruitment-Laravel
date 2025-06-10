<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatusesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('statuses')->updateOrInsert(
            ['id' => 1],
            ['name' => 'Pending', 'updated_at' => now(), 'created_at' => now()]
        );
        DB::table('statuses')->updateOrInsert(
            ['id' => 2],
            ['name' => 'In Progress', 'updated_at' => now(), 'created_at' => now()]
        );
        DB::table('statuses')->updateOrInsert(
            ['id' => 3],
            ['name' => 'Completed', 'updated_at' => now(), 'created_at' => now()]
        );
        DB::table('statuses')->updateOrInsert(
            ['id' => 4],
            ['name' => 'Rejected', 'updated_at' => now(), 'created_at' => now()]
        );
        DB::table('statuses')->updateOrInsert(
            ['id' => 5],
            ['name' => 'Hired', 'updated_at' => now(), 'created_at' => now()]
        );
    }
}
