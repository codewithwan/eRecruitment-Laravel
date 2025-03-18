<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Question;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            [
                'question' => '',
                'options' => [
                    "A. Saya cenderung membiarkan kesalahan kecil terjadi jika saya merasa itu tidak akan berdampak besar pada pekerjaan.",
                    "B. Saya selalu menegur bawahan saya atas kesalahan kecil untuk memastikan mereka tidak mengulanginya."
                ]
            ],
            [
                'question' => '',
                'options' => [
                    "A. Saya lebih suka menyelesaikan tugas saya sendiri daripada harus bergantung pada orang lain.",
                    "B. Saya lebih suka bekerja dalam tim dan berbagi tanggung jawab dengan rekan kerja."
                ]
            ],
            [
                'question' => '',
                'options' => [
                    "A. Jika ada keputusan sulit yang harus diambil, saya lebih suka menunggu hingga ada kepastian yang lebih jelas.",
                    "B. Saya lebih suka mengambil keputusan segera meskipun dengan informasi yang terbatas."
                ]
            ],
            [
                'question' => '',
                'options' => [
                    "A. Ketika menghadapi konflik di tempat kerja, saya cenderung menghindari konfrontasi langsung dan mencari solusi yang lebih diplomatis.",
                    "B. Saya lebih suka menghadapi konflik secara langsung dan menyelesaikannya secepat mungkin."
                ]
            ],
            [
                'question' => '',
                'options' => [
                    "A. Saya merasa nyaman ketika diberikan tugas dengan arahan yang jelas dan spesifik.",
                    "B. Saya lebih suka bekerja dengan fleksibilitas dan mencari solusi sendiri tanpa banyak arahan."
                ]
            ],
            [
                'question' => '',
                'options' => [
                    "A. Saya percaya bahwa aturan di tempat kerja harus diterapkan secara ketat tanpa pengecualian.",
                    "B. Saya percaya bahwa dalam beberapa situasi, aturan dapat sedikit disesuaikan untuk kepentingan bersama."
                ]
            ],
            [
                'question' => '',
                'options' => [
                    "A. Jika ada rekan kerja yang terus-menerus berperilaku kurang profesional, saya akan membicarakannya dengan atasan.",
                    "B. Saya akan mencoba menyelesaikan masalah dengan rekan kerja tersebut secara pribadi sebelum melibatkan atasan."
                ]
            ],
            [
                'question' => '',
                'options' => [
                    "A. Saya merasa lebih nyaman bekerja dengan rutinitas yang terstruktur dan dapat diprediksi.",
                    "B. Saya lebih suka bekerja dengan variasi tugas yang menantang dan tidak monoton."
                ]
            ],
            [
                'question' => '',
                'options' => [
                    "A. Jika saya memiliki ide yang berbeda dengan mayoritas tim, saya cenderung menyesuaikan diri demi menghindari konflik.",
                    "B. Saya tetap menyampaikan ide saya meskipun berbeda dengan mayoritas, karena saya percaya itu bisa bermanfaat."
                ]
            ],
            [
                'question' => '',
                'options' => [
                    "A. Saat menghadapi masalah dalam pekerjaan, saya lebih suka mencari solusi sendiri sebelum meminta bantuan orang lain.",
                    "B. Saya lebih suka berdiskusi dengan orang lain terlebih dahulu untuk mencari solusi terbaik."
                ]
            ]
        ];

        foreach ($questions as $question) {
            Question::create($question);
        }
    }
}
