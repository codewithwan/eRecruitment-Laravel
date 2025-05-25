<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContactsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('contacts')->insert([
            'email' => 'autentik.info@gmail.com',
            'phone' => '+62 81-807-700-111',
            'address' => 'Jl. Klipang Ruko Amsterdam No.9E, Sendangmulyo, Kec. Tembalang, Kota Semarang, Jawa Tengah 50272',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
