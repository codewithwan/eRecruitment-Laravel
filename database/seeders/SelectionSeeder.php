<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SelectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Don't specify IDs, let Laravel auto-increment them
        $selectionTypes = [
            ['name' => 'Administrasi', 'description' => 'Tahap seleksi administrasi kandidat'],
            ['name' => 'Psikotest', 'description' => 'Tahap seleksi psikotest kandidat'],
            ['name' => 'Wawancara', 'description' => 'Tahap seleksi wawancara kandidat'],
            ['name' => 'Hired', 'description' => 'Lamaran diterima'],
            ['name' => 'Rejected', 'description' => 'Lamaran ditolak']
        ];

        foreach ($selectionTypes as $selection) {
            // Only insert if the name doesn't exist
            if (!DB::table('selection')->where('name', $selection['name'])->exists()) {
                DB::table('selection')->insert([
                    'name' => $selection['name'],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }
    }
}
