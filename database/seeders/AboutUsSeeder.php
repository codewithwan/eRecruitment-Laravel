<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AboutUsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('about_us')->insert([
            'company_id' => 1, // pastikan company_id 1 ada di tabel companies
            'vision' => 'Menjadi perusahaan terdepan dalam inovasi dan pelayanan.',
            'mission' => '1. Memberikan solusi terbaik bagi pelanggan. 2. Meningkatkan kualitas SDM. 3. Berkontribusi pada kemajuan teknologi.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
