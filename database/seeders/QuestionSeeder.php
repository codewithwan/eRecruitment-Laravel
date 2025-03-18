<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            [
                'statement_number' => 1,
                'options' => [
                    "A. Saya cenderung membiarkan kesalahan kecil terjadi jika saya merasa itu tidak akan berdampak besar pada pekerjaan.",
                    "B. Saya selalu menegur bawahan saya atas kesalahan kecil untuk memastikan mereka tidak mengulanginya."
                ],
                'category' => 'leadership_style',
                'is_active' => true
            ],
            [
                'statement_number' => 2,
                'options' => [
                    "A. Saya lebih suka mengambil keputusan setelah berdiskusi dengan tim.",
                    "B. Saya lebih suka mengambil keputusan sendiri untuk efisiensi waktu."
                ],
                'category' => 'decision_making',
                'is_active' => true
            ],
            [
                'statement_number' => 3,
                'options' => [
                    "A. Saya lebih mementingkan hasil akhir daripada proses.",
                    "B. Saya sangat memperhatikan proses dan detail dalam setiap pekerjaan."
                ],
                'category' => 'work_style',
                'is_active' => true
            ],
            [
                'statement_number' => 4,
                'options' => [
                    "A. Saya lebih suka bekerja dengan deadline yang fleksibel.",
                    "B. Saya lebih produktif ketika ada deadline yang ketat."
                ],
                'category' => 'time_management',
                'is_active' => true
            ],
            [
                'statement_number' => 5,
                'options' => [
                    "A. Saya lebih suka mencari solusi yang sudah terbukti berhasil.",
                    "B. Saya senang mencoba pendekatan baru meskipun berisiko."
                ],
                'category' => 'innovation',
                'is_active' => true
            ]
        ];

        foreach ($questions as $question) {
            Question::create($question);
        }
    }
}