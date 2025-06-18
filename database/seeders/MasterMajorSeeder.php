<?php

namespace Database\Seeders;

use App\Models\MasterMajor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MasterMajorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $majors = [
            // Teknik
            'Teknik Informatika',
            'Teknik Elektro',
            'Teknik Mesin',
            'Teknik Sipil',
            'Teknik Industri',
            'Teknik Kimia',
            'Teknik Lingkungan',
            'Teknik Komputer',
            'Teknik Geodesi',
            'Teknik Pertambangan',
            'Teknik Arsitektur',
            'Teknik Biomedis',
            'Teknik Nuklir',
            'Teknik Fisika',
            'Teknik Material',
            
            // Ilmu Komputer
            'Ilmu Komputer',
            'Sistem Informasi',
            'Teknologi Informasi',
            'Rekayasa Perangkat Lunak',
            
            // Ekonomi & Bisnis
            'Manajemen',
            'Akuntansi',
            'Ekonomi Pembangunan',
            'Ekonomi Islam',
            'Bisnis Digital',
            'Keuangan dan Perbankan',
            'Manajemen Keuangan',
            'Ekonomi Syariah',
            
            // Hukum
            'Ilmu Hukum',
            'Hukum Bisnis',
            'Hukum Internasional',
            
            // Kedokteran & Kesehatan
            'Pendidikan Dokter',
            'Kedokteran Gigi',
            'Farmasi',
            'Keperawatan',
            'Kebidanan',
            'Gizi',
            'Kesehatan Masyarakat',
            'Fisioterapi',
            'Radiologi',
            'Analis Kesehatan',
            
            // Pendidikan
            'Pendidikan Guru Sekolah Dasar',
            'Pendidikan Bahasa Indonesia',
            'Pendidikan Bahasa Inggris',
            'Pendidikan Matematika',
            'Pendidikan Fisika',
            'Pendidikan Kimia',
            'Pendidikan Biologi',
            'Pendidikan Sejarah',
            'Pendidikan Geografi',
            'Pendidikan Olahraga',
            'Pendidikan Seni',
            
            // Ilmu Sosial & Politik
            'Ilmu Komunikasi',
            'Hubungan Internasional',
            'Ilmu Politik',
            'Sosiologi',
            'Antropologi',
            'Kriminologi',
            'Administrasi Publik',
            'Ilmu Pemerintahan',
            
            // Sastra & Bahasa
            'Sastra Indonesia',
            'Sastra Inggris',
            'Sastra Jepang',
            'Sastra Arab',
            'Linguistik',
            'Bahasa dan Kebudayaan Korea',
            'Bahasa dan Kebudayaan Mandarin',
            
            // Sains & Matematika
            'Matematika',
            'Fisika',
            'Kimia',
            'Biologi',
            'Statistika',
            'Geologi',
            'Geofisika',
            'Astronomi',
            'Meteorologi',
            
            // Psikologi
            'Psikologi',
            'Psikologi Klinis',
            'Psikologi Industri',
            
            // Seni & Desain
            'Desain Grafis',
            'Desain Interior',
            'Seni Rupa',
            'Seni Musik',
            'Seni Tari',
            'Seni Teater',
            'Film dan Televisi',
            'Fotografi',
            'Desain Komunikasi Visual',
            'Desain Produk',
            
            // Pertanian & Kehutanan
            'Agroteknologi',
            'Agribisnis',
            'Kehutanan',
            'Peternakan',
            'Perikanan',
            'Teknologi Pangan',
            'Ilmu Tanah',
            'Hortikultura',
            
            // Farmasi & Kimia
            'Kimia Murni',
            'Kimia Terapan',
            
            // Pariwisata & Perhotelan
            'Pariwisata',
            'Perhotelan',
            'Manajemen Perhotelan',
            'Administrasi Bisnis Pariwisata',
        ];

        foreach ($majors as $major) {
            MasterMajor::create([
                'name' => $major,
            ]);
        }
    }
} 