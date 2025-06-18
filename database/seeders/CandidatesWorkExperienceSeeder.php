<?php

namespace Database\Seeders;

use App\Models\CandidatesWorkExperience;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CandidatesWorkExperienceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get candidate users
        $candidateUsers = User::where('role', UserRole::CANDIDATE)->get();

        $jobTitles = [
            // IT & Technology
            'Software Engineer', 'Web Developer', 'Mobile Developer', 'Data Analyst', 'System Analyst',
            'DevOps Engineer', 'UI/UX Designer', 'Database Administrator', 'Network Administrator',
            'IT Support', 'Quality Assurance Engineer', 'Project Manager IT', 'Technical Lead',
            'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Machine Learning Engineer',
            
            // Business & Management
            'Business Analyst', 'Project Manager', 'Product Manager', 'Operations Manager',
            'Marketing Manager', 'Sales Manager', 'Account Manager', 'Business Development Manager',
            'Strategic Planning Manager', 'General Manager', 'Branch Manager', 'Team Leader',
            
            // Finance & Accounting
            'Financial Analyst', 'Accountant', 'Auditor', 'Tax Consultant', 'Credit Analyst',
            'Investment Analyst', 'Treasury Analyst', 'Finance Manager', 'Accounting Manager',
            'Chief Financial Officer', 'Budget Analyst', 'Cost Accountant',
            
            // Marketing & Sales
            'Digital Marketing Specialist', 'Content Creator', 'Social Media Manager', 'SEO Specialist',
            'Marketing Executive', 'Sales Executive', 'Brand Manager', 'Product Marketing Manager',
            'Campaign Manager', 'Market Research Analyst', 'Customer Success Manager',
            
            // Human Resources
            'HR Generalist', 'Recruiter', 'HR Business Partner', 'Training Specialist',
            'Compensation & Benefits Analyst', 'Employee Relations Specialist', 'HR Manager',
            'Talent Acquisition Specialist', 'Learning & Development Specialist',
            
            // Operations & Logistics
            'Operations Executive', 'Supply Chain Analyst', 'Logistics Coordinator',
            'Warehouse Manager', 'Procurement Specialist', 'Quality Control Inspector',
            'Production Supervisor', 'Operations Supervisor', 'Inventory Analyst',
            
            // Customer Service
            'Customer Service Representative', 'Customer Support Specialist', 'Call Center Agent',
            'Technical Support', 'Customer Success Executive', 'Client Relations Manager',
            
            // Administrative
            'Administrative Assistant', 'Executive Assistant', 'Office Manager',
            'Document Controller', 'Secretary', 'Data Entry Clerk', 'Receptionist',
            
            // Design & Creative
            'Graphic Designer', 'UI Designer', 'UX Designer', 'Creative Director',
            'Art Director', 'Video Editor', 'Photographer', 'Content Writer',
            
            // Entry Level Positions
            'Intern', 'Trainee', 'Junior Developer', 'Junior Analyst', 'Assistant Manager',
            'Staff', 'Executive Trainee', 'Management Trainee',
        ];

        $employmentStatuses = [
            'Karyawan Tetap',
            'Karyawan Kontrak',
            'Freelancer',
            'Part Time',
            'Magang',
            'Konsultan',
            'Volunteer',
        ];

        $companies = [
            // Tech Companies
            'PT. Gojek Indonesia', 'PT. Tokopedia', 'PT. Bukalapak', 'PT. Traveloka Indonesia',
            'PT. Shopee International Indonesia', 'PT. Grab Indonesia', 'PT. Blibli.com',
            'PT. Ruangguru', 'PT. Kaskus', 'PT. Halodoc', 'PT. Ovo', 'PT. Dana Indonesia',
            
            // Banking & Finance
            'PT. Bank Central Asia Tbk', 'PT. Bank Mandiri Tbk', 'PT. Bank Rakyat Indonesia Tbk',
            'PT. Bank Negara Indonesia Tbk', 'PT. Bank CIMB Niaga Tbk', 'PT. Bank Danamon Indonesia Tbk',
            'PT. Bank Permata Tbk', 'PT. Prudential Life Assurance', 'PT. AXA Mandiri Financial Services',
            
            // Telecommunication
            'PT. Telekomunikasi Indonesia Tbk', 'PT. Indosat Ooredoo Hutchison', 'PT. XL Axiata Tbk',
            'PT. Smartfren Telecom Tbk', 'PT. Telkomsel',
            
            // Retail & FMCG
            'PT. Unilever Indonesia Tbk', 'PT. Nestlé Indonesia', 'PT. Procter & Gamble Indonesia',
            'PT. Indomaret', 'PT. Alfamart', 'PT. Matahari Department Store Tbk',
            'PT. Ace Hardware Indonesia Tbk', 'PT. Hypermart',
            
            // Manufacturing
            'PT. Astra International Tbk', 'PT. Toyota Motor Manufacturing Indonesia',
            'PT. Honda Prospect Motor', 'PT. Suzuki Indomobil Sales', 'PT. Mitsubishi Motors Krama Yudha Sales Indonesia',
            
            // Energy & Mining
            'PT. Pertamina', 'PT. PLN', 'PT. Adaro Energy Tbk', 'PT. Medco Energi Internasional Tbk',
            
            // Consulting & Services
            'PT. McKinsey & Company Indonesia', 'PT. Boston Consulting Group', 'PT. Deloitte Consulting',
            'PT. PricewaterhouseCoopers Indonesia', 'PT. Ernst & Young Indonesia',
            
            // Media & Entertainment
            'PT. Media Nusantara Citra Tbk', 'PT. Surya Citra Media Tbk', 'PT. Viva Media Asia',
            'PT. Kompas Gramedia', 'PT. Tempo Inti Media',
            
            // Property & Construction
            'PT. Ciputra Development Tbk', 'PT. Lippo Karawaci Tbk', 'PT. Agung Podomoro Land Tbk',
            'PT. Summarecon Agung Tbk', 'PT. Waskita Karya Tbk',
            
            // Government & NGO
            'Kementerian Komunikasi dan Informatika', 'Kementerian Keuangan',
            'Pemerintah Provinsi DKI Jakarta', 'Badan Pusat Statistik', 'World Wildlife Fund Indonesia',
            'Yayasan Plan International Indonesia', 'Palang Merah Indonesia',
        ];

        foreach ($candidateUsers as $user) {
            // Each candidate gets 0-4 work experiences
            $numberOfExperiences = rand(0, 4);
            
            $currentYear = date('Y');
            $currentMonth = date('n');
            
            for ($i = 0; $i < $numberOfExperiences; $i++) {
                $startYear = rand(2015, $currentYear - 1);
                $startMonth = rand(1, 12);
                
                $isCurrentJob = ($i == 0) ? rand(0, 1) : 0; // Only first experience can be current
                
                if ($isCurrentJob) {
                    $endYear = null;
                    $endMonth = null;
                } else {
                    $endYear = rand($startYear, $currentYear);
                    if ($endYear == $currentYear) {
                        $endMonth = rand(1, $currentMonth);
                    } else {
                        $endMonth = rand(1, 12);
                    }
                    
                    // Ensure end date is after start date
                    if ($endYear == $startYear && $endMonth <= $startMonth) {
                        $endMonth = $startMonth + rand(1, 12 - $startMonth);
                        if ($endMonth > 12) {
                            $endMonth = 12;
                        }
                    }
                }
                
                $jobTitle = $jobTitles[array_rand($jobTitles)];
                $company = $companies[array_rand($companies)];
                
                CandidatesWorkExperience::create([
                    'user_id' => $user->id,
                    'job_title' => $jobTitle,
                    'employment_status' => $employmentStatuses[array_rand($employmentStatuses)],
                    'job_description' => $this->generateJobDescription($jobTitle, $company),
                    'is_current_job' => $isCurrentJob,
                    'start_month' => $startMonth,
                    'start_year' => $startYear,
                    'end_month' => $endMonth,
                    'end_year' => $endYear,
                ]);
            }
        }
    }

    private function generateJobDescription($jobTitle, $company)
    {
        $descriptions = [
            'Bertanggung jawab dalam pengembangan dan pemeliharaan sistem aplikasi untuk mendukung operasional bisnis perusahaan.',
            'Mengelola proyek dari tahap perencanaan hingga implementasi dengan memastikan kualitas dan deadline yang tepat.',
            'Melakukan analisis data untuk memberikan insight bisnis dan mendukung pengambilan keputusan strategis.',
            'Mengembangkan strategi pemasaran digital untuk meningkatkan brand awareness dan penjualan produk.',
            'Mengelola hubungan dengan klien dan memastikan kepuasan pelanggan melalui layanan yang berkualitas.',
            'Bertanggung jawab dalam rekrutmen, training, dan pengembangan SDM untuk mencapai target organisasi.',
            'Melakukan audit internal dan memastikan compliance terhadap regulasi dan standar perusahaan.',
            'Mengoptimalkan proses operasional untuk meningkatkan efisiensi dan mengurangi biaya operasional.',
            'Mengembangkan dan memelihara website serta aplikasi mobile untuk meningkatkan user experience.',
            'Mengelola campaign marketing dan menganalisis performance untuk optimasi ROI.',
        ];

        return $descriptions[array_rand($descriptions)] . ' Bekerja di ' . $company . ' sebagai ' . $jobTitle . '.';
    }
} 