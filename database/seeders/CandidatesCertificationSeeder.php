<?php

namespace Database\Seeders;

use App\Models\CandidatesCertification;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CandidatesCertificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get candidate users
        $candidateUsers = User::where('role', UserRole::CANDIDATE)->get();

        $certifications = [
            // IT & Technology
            'Certified Information Systems Security Professional (CISSP)',
            'CompTIA Security+',
            'Certified Ethical Hacker (CEH)',
            'AWS Certified Solutions Architect',
            'Microsoft Azure Fundamentals',
            'Google Cloud Professional',
            'Oracle Certified Professional',
            'Certified ScrumMaster (CSM)',
            'Project Management Professional (PMP)',
            'ITIL Foundation',
            'Cisco Certified Network Associate (CCNA)',
            'Red Hat Certified System Administrator',
            'VMware Certified Professional',
            'Salesforce Administrator',
            'Certified Kubernetes Administrator',
            
            // Finance & Accounting
            'Chartered Accountant (CA)',
            'Certified Public Accountant (CPA)',
            'Certified Management Accountant (CMA)',
            'Financial Risk Manager (FRM)',
            'Chartered Financial Analyst (CFA)',
            'Certified Internal Auditor (CIA)',
            'Certified Fraud Examiner (CFE)',
            'Certified Treasury Professional (CTP)',
            
            // Digital Marketing
            'Google Analytics Certified',
            'Google Ads Certified',
            'Facebook Blueprint Certification',
            'HubSpot Content Marketing Certification',
            'Hootsuite Social Media Marketing Certification',
            'Digital Marketing Institute Certification',
            'SEMrush SEO Toolkit Certification',
            'Bing Ads Accredited Professional',
            
            // Human Resources
            'Professional in Human Resources (PHR)',
            'Senior Professional in Human Resources (SPHR)',
            'Certified Compensation Professional (CCP)',
            'Certified Employee Benefits Specialist (CEBS)',
            'Global Professional in Human Resources (GPHR)',
            'Society for Human Resource Management (SHRM-CP)',
            
            // Project Management
            'Project Management Professional (PMP)',
            'Certified Associate in Project Management (CAPM)',
            'PRINCE2 Foundation',
            'PRINCE2 Practitioner',
            'Agile Certified Practitioner (PMI-ACP)',
            'Certified ScrumMaster (CSM)',
            'Professional Scrum Master (PSM)',
            
            // Quality & Process
            'Six Sigma Green Belt',
            'Six Sigma Black Belt',
            'Lean Manufacturing Certification',
            'ISO 9001 Lead Auditor',
            'ISO 14001 Environmental Management',
            'OHSAS 18001 Occupational Health and Safety',
            
            // Sales & Customer Service
            'Certified Sales Professional (CSP)',
            'Certified Customer Service Professional',
            'Salesforce Sales Cloud Consultant',
            'HubSpot Sales Software Certification',
            
            // Design & Creative
            'Adobe Certified Expert (ACE)',
            'Adobe Certified Associate (ACA)',
            'Autodesk Certified User',
            'Unity Certified Developer',
            'Google UX Design Certificate',
            
            // Language & Communication
            'Certified Professional Technical Communicator',
            'International Association of Business Communicators (IABC)',
            'Professional Certified Marketer (PCM)',
            
            // Healthcare & Safety
            'Certified Occupational Health and Safety Professional',
            'First Aid CPR Certification',
            'ISO 45001 Lead Implementer',
            'Environmental Management System Auditor',
            
            // Indonesia Specific
            'Sertifikat Kompetensi BNSP',
            'Sertifikat Profesi Akuntan Publik',
            'Sertifikat Manajemen Risiko Indonesia',
            'Sertifikat Ahli K3 Umum',
            'Sertifikat Pelatihan Kerja Kemnaker',
        ];

        foreach ($candidateUsers as $user) {
            // 70% chance for each candidate to have professional certification
            if (rand(1, 100) <= 70) {
                // Each candidate gets 1-3 certifications
                $numberOfCertifications = rand(1, 3);
                $userCertifications = array_rand(array_flip($certifications), $numberOfCertifications);
                
                if (!is_array($userCertifications)) {
                    $userCertifications = [$userCertifications];
                }
                
                foreach ($userCertifications as $certification) {
                    CandidatesCertification::create([
                        'user_id' => $user->id,
                        'certification_name' => $certification,
                        'certificate_file' => 'certificates/professional/' . str_replace([' ', '(', ')'], ['_', '', ''], strtolower($certification)) . '_' . $user->id . '.pdf',
                    ]);
                }
            }
        }
    }
} 