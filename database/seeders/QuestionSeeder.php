<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Choice;
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
                'question_type' => 'multiple_choice'
            ],
            [
                'question_text' => 'Bagaimana Anda menangani konflik di tempat kerja?',
                'question_type' => 'multiple_choice'
            ],
            [
                'question_text' => '5 + 3 × 2 = ?',
                'question_type' => 'arithmetic'
            ],
            [
                'question_text' => 'Jika harga sebuah barang naik 20% dan kemudian turun 20%, maka harga akhirnya dibandingkan dengan harga awal adalah...',
                'question_type' => 'logical'
            ],
            [
                'question_text' => 'Apa kepanjangan dari HTML?',
                'question_type' => 'knowledge'
            ]
        ];

        $questionsWithChoices = [
            [
                'question' => $questions[0],
                'choices' => [
                    ['choice_text' => 'Pengalaman belajar', 'is_correct' => false],
                    ['choice_text' => 'Jenjang karir', 'is_correct' => false],
                    ['choice_text' => 'Gaji dan tunjangan', 'is_correct' => false],
                    ['choice_text' => 'Semua jawaban benar', 'is_correct' => true],
                ]
            ],
            [
                'question' => $questions[1],
                'choices' => [
                    ['choice_text' => 'Menghindari konflik', 'is_correct' => false],
                    ['choice_text' => 'Menghadapi konflik secara langsung', 'is_correct' => false],
                    ['choice_text' => 'Mencari bantuan mediator', 'is_correct' => false],
                    ['choice_text' => 'Mencari solusi bersama', 'is_correct' => true],
                ]
            ],
            [
                'question' => $questions[2],
                'choices' => [
                    ['choice_text' => '11', 'is_correct' => true],
                    ['choice_text' => '16', 'is_correct' => false],
                    ['choice_text' => '8', 'is_correct' => false],
                    ['choice_text' => '10', 'is_correct' => false],
                ]
            ],
            [
                'question' => $questions[3],
                'choices' => [
                    ['choice_text' => 'Sama', 'is_correct' => false],
                    ['choice_text' => 'Lebih tinggi', 'is_correct' => false],
                    ['choice_text' => 'Lebih rendah 4%', 'is_correct' => true],
                    ['choice_text' => 'Lebih rendah 10%', 'is_correct' => false],
                ]
            ],
            [
                'question' => $questions[4],
                'choices' => [
                    ['choice_text' => 'Hyper Text Markup Language', 'is_correct' => true],
                    ['choice_text' => 'High Tech Multi Language', 'is_correct' => false],
                    ['choice_text' => 'Hyper Transfer Markup Language', 'is_correct' => false],
                    ['choice_text' => 'Home Tool Markup Language', 'is_correct' => false],
                ]
            ]
        ];

        foreach ($questionsWithChoices as $item) {
            $questionModel = Question::create($item['question']);
            
            foreach ($item['choices'] as $choiceData) {
                Choice::create([
                    'question_id' => $questionModel->id,
                    'choice_text' => $choiceData['choice_text'],
                    'is_correct' => $choiceData['is_correct'],
                ]);
            }
        }
    }
}
