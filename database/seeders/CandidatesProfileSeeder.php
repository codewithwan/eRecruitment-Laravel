<?php

namespace Database\Seeders;

use App\Models\CandidatesProfile;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CandidatesProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get candidate users
        $candidateUsers = User::where('role', UserRole::CANDIDATE)->get();

        $provinces = [
            'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Yogyakarta',
            'Banten', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Jambi',
            'Sumatera Selatan', 'Bengkulu', 'Lampung', 'Kepulauan Bangka Belitung',
            'Kepulauan Riau', 'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan',
            'Kalimantan Timur', 'Kalimantan Utara', 'Bali', 'Nusa Tenggara Barat',
            'Nusa Tenggara Timur', 'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan',
            'Sulawesi Tenggara', 'Gorontalo', 'Sulawesi Barat', 'Maluku', 'Maluku Utara',
            'Papua', 'Papua Barat'
        ];

        $cities = [
            'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat',
            'Bandung', 'Bekasi', 'Depok', 'Tangerang', 'Bogor', 'Semarang', 'Surabaya',
            'Yogyakarta', 'Malang', 'Solo', 'Medan', 'Palembang', 'Makassar', 'Denpasar',
            'Balikpapan', 'Pekanbaru', 'Bandar Lampung', 'Padang', 'Manado'
        ];

        $placeOfBirths = [
            'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 'Palembang', 'Makassar',
            'Denpasar', 'Yogyakarta', 'Malang', 'Solo', 'Bogor', 'Depok', 'Tangerang',
            'Bekasi', 'Padang', 'Pekanbaru', 'Balikpapan', 'Manado', 'Pontianak'
        ];

        foreach ($candidateUsers as $index => $user) {
            $province = $provinces[array_rand($provinces)];
            $city = $cities[array_rand($cities)];
            $placeOfBirth = $placeOfBirths[array_rand($placeOfBirths)];
            
            CandidatesProfile::create([
                'user_id' => $user->id,
                'no_ektp' => '3171' . str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT) . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
                'gender' => rand(0, 1) ? 'Laki-laki' : 'Perempuan',
                'phone_number' => '08' . rand(10000000, 99999999),
                'npwp' => rand(0, 1) ? rand(10, 99) . '.' . rand(100, 999) . '.' . rand(100, 999) . '.' . rand(1, 9) . '-' . rand(100, 999) . '.000' : null,
                'about_me' => 'Saya adalah lulusan ' . $this->getRandomEducation() . ' yang memiliki passion di bidang teknologi dan inovasi. Saya senang belajar hal-hal baru dan selalu berusaha memberikan yang terbaik dalam setiap pekerjaan. Memiliki kemampuan komunikasi yang baik dan dapat bekerja dalam tim maupun individu.',
                'place_of_birth' => $placeOfBirth,
                'date_of_birth' => now()->subYears(rand(22, 35))->subDays(rand(1, 365)),
                'address' => 'Jl. ' . $this->getRandomStreetName() . ' No. ' . rand(1, 100) . ', RT ' . str_pad(rand(1, 20), 2, '0', STR_PAD_LEFT) . ' RW ' . str_pad(rand(1, 10), 2, '0', STR_PAD_LEFT),
                'province' => $province,
                'city' => $city,
                'district' => $this->getRandomDistrict(),
                'village' => $this->getRandomVillage(),
                'rt' => str_pad(rand(1, 20), 2, '0', STR_PAD_LEFT),
                'rw' => str_pad(rand(1, 10), 2, '0', STR_PAD_LEFT),
            ]);
        }
    }

    private function getRandomEducation()
    {
        $educations = [
            'Teknik Informatika', 'Sistem Informasi', 'Manajemen', 'Akuntansi', 'Ekonomi',
            'Psikologi', 'Ilmu Komunikasi', 'Teknik Elektro', 'Teknik Mesin', 'Hukum',
            'Kedokteran', 'Farmasi', 'Pendidikan', 'Sastra', 'Matematika', 'Fisika'
        ];
        return $educations[array_rand($educations)];
    }

    private function getRandomStreetName()
    {
        $streets = [
            'Sudirman', 'Thamrin', 'Gatot Subroto', 'Kuningan', 'Rasuna Said', 'Diponegoro',
            'Ahmad Yani', 'Veteran', 'Pahlawan', 'Merdeka', 'Proklamasi', 'Pancasila',
            'Kartini', 'Cut Nyak Dien', 'Dewi Sartika', 'Hasanuddin', 'Juanda', 'Pemuda'
        ];
        return $streets[array_rand($streets)];
    }

    private function getRandomDistrict()
    {
        $districts = [
            'Menteng', 'Kebayoran Baru', 'Kemang', 'Senayan', 'Kuningan', 'Cikini',
            'Gondangdia', 'Tanah Abang', 'Setiabudi', 'Tebet', 'Mampang', 'Pancoran'
        ];
        return $districts[array_rand($districts)];
    }

    private function getRandomVillage()
    {
        $villages = [
            'Menteng Atas', 'Menteng Dalam', 'Karet', 'Karet Kuningan', 'Setia Budi',
            'Kuningan Timur', 'Karet Tengsin', 'Gelora', 'Bendungan Hilir', 'Petamburan'
        ];
        return $villages[array_rand($villages)];
    }
} 