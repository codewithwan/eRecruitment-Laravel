<?php

namespace Database\Seeders;

use App\Models\AboutUs;
use App\Models\Company;
use Illuminate\Database\Seeder;

class AboutUsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = Company::all();

        if ($companies->isEmpty()) {
            $this->command->error('No companies found. Please run CompanySeeder first.');
            return;
        }

        $visionMissionData = [
            [
                'vision' => 'Menjadi perusahaan teknologi terdepan yang mengubah dunia melalui inovasi berkelanjutan dan solusi digital yang memberdayakan masyarakat.',
                'mission' => 'Mengembangkan teknologi terdepan, memberikan layanan berkualitas tinggi, membangun komunitas teknologi yang inklusif, dan berkontribusi pada kemajuan bangsa melalui transformasi digital.'
            ],
            [
                'vision' => 'Memimpin industri finansial dengan menyediakan layanan perbankan yang terpercaya, inovatif, dan berkelanjutan untuk kesejahteraan masyarakat.',
                'mission' => 'Memberikan layanan finansial terbaik, mengembangkan produk inovatif yang sesuai kebutuhan nasabah, membangun kepercayaan melalui transparansi, dan mendukung pertumbuhan ekonomi nasional.'
            ],
            [
                'vision' => 'Menjadi penyedia layanan kesehatan terdepan yang memberikan perawatan berkualitas tinggi dan aksesible untuk seluruh masyarakat.',
                'mission' => 'Menyediakan layanan kesehatan komprehensif, mengembangkan tenaga medis profesional, menerapkan teknologi medis terdepan, dan meningkatkan kualitas hidup masyarakat.'
            ],
            [
                'vision' => 'Membangun ekosistem pendidikan yang unggul untuk mencetak generasi yang kompetitif dan berkarakter di tingkat global.',
                'mission' => 'Menyelenggarakan pendidikan berkualitas, mengembangkan kurikulum yang relevan, memberdayakan pendidik profesional, dan memfasilitasi akses pendidikan yang merata.'
            ],
            [
                'vision' => 'Menjadi perusahaan ritel terkemuka yang memberikan pengalaman berbelanja terbaik dengan produk berkualitas dan layanan prima.',
                'mission' => 'Menyediakan produk berkualitas dengan harga terjangkau, memberikan pengalaman berbelanja yang menyenangkan, membangun hubungan jangka panjang dengan pelanggan, dan mendukung produk lokal.'
            ],
            [
                'vision' => 'Memimpin industri manufaktur dengan menghasilkan produk berkualitas tinggi yang ramah lingkungan dan berkelanjutan.',
                'mission' => 'Memproduksi barang berkualitas internasional, menerapkan praktik ramah lingkungan, mengembangkan SDM kompeten, dan berkontribusi pada pertumbuhan ekonomi lokal.'
            ],
            [
                'vision' => 'Menjadi penyedia solusi logistik dan transportasi yang handal, efisien, dan berkelanjutan untuk mendukung pertumbuhan ekonomi.',
                'mission' => 'Memberikan layanan logistik terpadu, mengoptimalkan efisiensi distribusi, menerapkan teknologi canggih, dan membangun jaringan transportasi yang luas.'
            ],
            [
                'vision' => 'Membangun industri pariwisata yang berkelanjutan untuk mempromosikan kekayaan budaya dan alam Indonesia kepada dunia.',
                'mission' => 'Mengembangkan destinasi wisata berkualitas, melestarikan budaya dan lingkungan, memberdayakan masyarakat lokal, dan meningkatkan ekonomi daerah melalui pariwisata.'
            ]
        ];

        foreach ($companies as $index => $company) {
            $data = $visionMissionData[$index % count($visionMissionData)];
            
            AboutUs::create([
                'company_id' => $company->id,
                'vision' => $data['vision'],
                'mission' => $data['mission'],
            ]);
        }

        $this->command->info('AboutUs seeder completed successfully.');
    }
} 