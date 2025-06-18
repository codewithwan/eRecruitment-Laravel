<?php

namespace Database\Seeders;

use App\Models\CandidatesAchivement;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CandidatesAchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get candidate users
        $candidateUsers = User::where('role', UserRole::CANDIDATE)->get();

        $achievements = [
            // Academic Achievements
            'Juara 1 Kompetisi Karya Tulis Ilmiah Nasional',
            'Juara 2 Lomba Inovasi Teknologi Nasional',
            'Juara 3 Olimpiade Matematika Nasional',
            'Pemenang Hackathon Indonesia',
            'Juara Debat Bahasa Inggris Nasional',
            'Best Paper Award Conference Internasional',
            'Mahasiswa Berprestasi Tingkat Nasional',
            'Cumlaude Graduate Award',
            'Outstanding Student Achievement',
            'Academic Excellence Award',
            
            // Technology & Innovation
            'Juara Startup Competition Indonesia',
            'Winner Digital Innovation Challenge',
            'Best Mobile App Developer Award',
            'Juara Coding Competition Nasional',
            'Innovation Award Tech Summit',
            'Best Web Design Competition',
            'AI/ML Competition Winner',
            'Cybersecurity Challenge Champion',
            'Google Developer Challenge Winner',
            'Microsoft Imagine Cup Finalist',
            
            // Business & Entrepreneurship
            'Young Entrepreneur Award',
            'Business Plan Competition Winner',
            'Best Startup Idea Award',
            'Social Impact Business Award',
            'E-commerce Innovation Award',
            'Digital Marketing Excellence Award',
            'Sales Achievement Award',
            'Leadership Excellence Recognition',
            'Business Innovation Champion',
            'Entrepreneur of the Year',
            
            // Arts & Creative
            'Juara Lomba Fotografi Nasional',
            'Best Design Competition Winner',
            'Creative Writing Award',
            'Film Festival Award Winner',
            'Art Exhibition Best Artist',
            'Music Competition Champion',
            'Dance Competition Winner',
            'Theater Performance Award',
            'Creative Innovation Award',
            'Cultural Heritage Award',
        ];

        $levels = ['Internasional', 'Nasional', 'Regional', 'Lokal'];
        $months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        foreach ($candidateUsers as $user) {
            // 60% chance for each candidate to have achievements
            if (rand(1, 100) <= 60) {
                // Each candidate gets 1-2 achievements
                $numberOfAchievements = rand(1, 2);
                
                for ($i = 0; $i < $numberOfAchievements; $i++) {
                    $achievement = $achievements[array_rand($achievements)];
                    $level = $levels[array_rand($levels)];
                    $month = $months[array_rand($months)];
                    $year = rand(2018, 2024);
                    
                    CandidatesAchivement::create([
                        'user_id' => $user->id,
                        'title' => $achievement,
                        'level' => $level,
                        'month' => $month,
                        'year' => $year,
                        'description' => $this->generateAchievementDescription($achievement, $level),
                        'certificate_file' => 'certificates/achievements/' . str_replace([' ', '/'], ['_', '_'], strtolower($achievement)) . '_' . $user->id . '.pdf',
                        'supporting_file' => rand(0, 1) ? 'supporting/achievements/' . str_replace([' ', '/'], ['_', '_'], strtolower($achievement)) . '_support_' . $user->id . '.pdf' : null,
                    ]);
                }
            }
        }
    }

    private function generateAchievementDescription($achievement, $level)
    {
        $descriptions = [
            'Berhasil meraih prestasi gemilang dalam kompetisi bergengsi tingkat ' . strtolower($level) . ' dengan menunjukkan keunggulan dan dedikasi yang luar biasa.',
            'Memperoleh pengakuan atas kontribusi dan inovasi yang memberikan dampak positif signifikan dalam bidang yang ditekuni.',
            'Terpilih sebagai pemenang dalam seleksi ketat dengan menunjukkan kemampuan exceptional dan leadership yang outstanding.',
            'Mendapatkan apresiasi atas pencapaian yang membanggakan dan menjadi inspirasi bagi banyak orang di bidang tersebut.',
            'Berhasil unggul dalam kompetisi dengan menampilkan performa terbaik dan konsistensi yang patut diacungi jempol.',
        ];
        
        return $descriptions[array_rand($descriptions)] . ' Prestasi ini diraih pada tingkat ' . strtolower($level) . '.';
    }
} 