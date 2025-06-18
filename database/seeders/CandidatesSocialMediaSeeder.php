<?php

namespace Database\Seeders;

use App\Models\CandidatesSocialMedia;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CandidatesSocialMediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get candidate users
        $candidateUsers = User::where('role', UserRole::CANDIDATE)->get();

        $socialPlatforms = [
            'LinkedIn',
            'Instagram',
            'Twitter',
            'Facebook',
            'TikTok',
            'YouTube',
            'GitHub',
            'Behance',
            'Dribbble',
            'Medium',
            'Personal Website',
            'Portfolio Website',
            'Blog',
        ];

        foreach ($candidateUsers as $user) {
            // 80% chance for each candidate to have social media
            if (rand(1, 100) <= 80) {
                // Each candidate gets 1-4 social media platforms
                $numberOfPlatforms = rand(1, 4);
                $userPlatforms = array_rand(array_flip($socialPlatforms), $numberOfPlatforms);
                
                if (!is_array($userPlatforms)) {
                    $userPlatforms = [$userPlatforms];
                }
                
                foreach ($userPlatforms as $platform) {
                    $url = $this->generateSocialMediaUrl($platform, $user->name);
                    
                    CandidatesSocialMedia::create([
                        'user_id' => $user->id,
                        'platform_name' => $platform,
                        'url' => $url,
                    ]);
                }
            }
        }
    }

    private function generateSocialMediaUrl($platform, $userName)
    {
        $username = strtolower(str_replace(' ', '', $userName)) . rand(100, 999);
        
        switch ($platform) {
            case 'LinkedIn':
                return 'https://www.linkedin.com/in/' . $username;
            case 'Instagram':
                return 'https://www.instagram.com/' . $username;
            case 'Twitter':
                return 'https://twitter.com/' . $username;
            case 'Facebook':
                return 'https://www.facebook.com/' . $username;
            case 'TikTok':
                return 'https://www.tiktok.com/@' . $username;
            case 'YouTube':
                return 'https://www.youtube.com/channel/' . $username;
            case 'GitHub':
                return 'https://github.com/' . $username;
            case 'Behance':
                return 'https://www.behance.net/' . $username;
            case 'Dribbble':
                return 'https://dribbble.com/' . $username;
            case 'Medium':
                return 'https://medium.com/@' . $username;
            case 'Personal Website':
                return 'https://' . $username . '.com';
            case 'Portfolio Website':
                return 'https://portfolio.' . $username . '.com';
            case 'Blog':
                return 'https://blog.' . $username . '.com';
            default:
                return 'https://www.' . strtolower($platform) . '.com/' . $username;
        }
    }
} 