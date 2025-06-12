<?php

namespace Database\Seeders;

use App\Models\Statuses;
use Illuminate\Database\Seeder;

class StatusesSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'Pending',
                'color' => '#FFA500', // Orange
                'description' => 'Aplikasi sedang diproses'
            ],
            [
                'name' => 'Interviewed',
                'color' => '#4B89DC', // Blue
                'description' => 'Kandidat telah diinterview'
            ],
            [
                'name' => 'Accepted',
                'color' => '#8CC152', // Green
                'description' => 'Lamaran diterima'
            ],
            [
                'name' => 'Rejected',
                'color' => '#DA4453', // Red
                'description' => 'Lamaran ditolak'
            ]
        ];

        foreach ($statuses as $status) {
            Statuses::firstOrCreate(
                ['name' => $status['name']],
                $status
            );
        }
    }
}
