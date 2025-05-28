<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            [
                'question_text' => 'Apa yang membuat Anda tertarik untuk melamar posisi ini?',
                'options' => json_encode([
                    'Pengalaman belajar',
                    'Jenjang karir',
                    'Gaji dan tunjangan',
                    'Reputasi perusahaan'
                ]),
                'correct_answer' => 'Semua jawaban benar',
                'question_type' => 'multiple_choice'
            ],
            [
                'question_text' => 'Bagaimana Anda menangani konflik di tempat kerja?',
                'options' => json_encode([
                    'Menghindari konflik',
                    'Menghadapi konflik secara langsung',
                    'Mencari bantuan mediator',
                    'Mencari solusi bersama'
                ]),
                'correct_answer' => 'Mencari solusi bersama',
                'question_type' => 'multiple_choice'
            ],
            [
                'question_text' => '5 + 3 × 2 = ?',
                'options' => json_encode(['11', '16', '8', '10']),
                'correct_answer' => '11',
                'question_type' => 'arithmetic'
            ],
            [
                'question_text' => 'Jika harga sebuah barang naik 20% dan kemudian turun 20%, maka harga akhirnya dibandingkan dengan harga awal adalah...',
                'options' => json_encode(['Sama', 'Lebih tinggi', 'Lebih rendah 4%', 'Lebih rendah 10%']),
                'correct_answer' => 'Lebih rendah 4%',
                'question_type' => 'logical'
            ],
            [
                'question_text' => 'Apa kepanjangan dari HTML?',
                'options' => json_encode([
                    'Hyper Text Markup Language',
                    'High Tech Multi Language',
                    'Hyper Transfer Markup Language',
                    'Home Tool Markup Language'
                ]),
                'correct_answer' => 'Hyper Text Markup Language',
                'question_type' => 'knowledge'
            ]
        ];

        foreach ($questions as $question) {
            Question::create($question);
        }
    }
}
