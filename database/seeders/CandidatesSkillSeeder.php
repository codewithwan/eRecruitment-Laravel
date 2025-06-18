<?php

namespace Database\Seeders;

use App\Models\CandidatesSkill;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CandidatesSkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get candidate users
        $candidateUsers = User::where('role', UserRole::CANDIDATE)->get();

        $skills = [
            // Programming & Technical Skills
            'PHP', 'Laravel', 'JavaScript', 'React', 'Vue.js', 'Node.js', 'Python',
            'Java', 'C++', 'C#', 'HTML/CSS', 'MySQL', 'PostgreSQL', 'MongoDB',
            'Git', 'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Microsoft Azure',
            
            // Business & Management
            'Project Management', 'Team Leadership', 'Strategic Planning', 'Business Analysis',
            'Risk Management', 'Quality Assurance', 'Process Improvement', 'Budgeting',
            'Financial Analysis', 'Market Research', 'Sales Management', 'Customer Relationship Management',
            
            // Digital Marketing
            'Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing', 'Content Marketing',
            'Email Marketing', 'Google Analytics', 'Facebook Ads', 'Instagram Marketing',
            'YouTube Marketing', 'Influencer Marketing', 'Brand Management',
            
            // Design & Creative
            'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Figma', 'Sketch',
            'UI/UX Design', 'Graphic Design', 'Web Design', 'Video Editing', 'Photography',
            'Adobe After Effects', 'Adobe Premiere Pro', 'Canva', 'CorelDraw',
            
            // Communication & Language
            'Public Speaking', 'Presentation Skills', 'Written Communication', 'Bahasa Indonesia',
            'English (Professional)', 'English (Business)', 'Mandarin', 'Japanese', 'Korean',
            'Arabic', 'German', 'French', 'Customer Service', 'Negotiation',
            
            // Office & Administrative
            'Microsoft Office', 'Microsoft Excel', 'Microsoft PowerPoint', 'Microsoft Word',
            'Google Workspace', 'Data Entry', 'Administrative Support', 'Document Management',
            'Schedule Management', 'Event Planning', 'Travel Coordination',
            
            // Accounting & Finance
            'Accounting', 'Financial Reporting', 'Tax Preparation', 'Audit', 'Cash Flow Management',
            'Investment Analysis', 'Banking', 'Insurance', 'Payroll Processing', 'Bookkeeping',
            
            // Human Resources
            'Recruitment', 'Employee Training', 'Performance Management', 'HR Policies',
            'Compensation & Benefits', 'Employee Relations', 'Training & Development',
            'Talent Acquisition', 'Organizational Development',
            
            // Operations & Logistics
            'Supply Chain Management', 'Inventory Management', 'Warehouse Management',
            'Transportation', 'Procurement', 'Vendor Management', 'Quality Control',
            'Production Planning', 'Lean Manufacturing', 'Six Sigma',
            
            // Healthcare
            'Patient Care', 'Medical Terminology', 'Healthcare Administration', 'Clinical Research',
            'Pharmacy', 'Nursing', 'Medical Coding', 'Health Information Management',
            
            // Education & Training
            'Curriculum Development', 'Instructional Design', 'E-learning', 'Training Delivery',
            'Student Assessment', 'Educational Technology', 'Research Methods',
            
            // Engineering
            'CAD Design', 'AutoCAD', 'SolidWorks', 'Project Engineering', 'Quality Engineering',
            'Process Engineering', 'Manufacturing', 'Maintenance', 'Safety Management',
            
            // Sales & Customer Relations
            'Sales Strategy', 'Lead Generation', 'Client Relations', 'Product Knowledge',
            'Sales Presentation', 'Cold Calling', 'CRM Software', 'Territory Management',
        ];

        foreach ($candidateUsers as $user) {
            // Each candidate gets 3-8 random skills
            $numberOfSkills = rand(3, 8);
            $userSkills = array_rand(array_flip($skills), $numberOfSkills);
            
            if (!is_array($userSkills)) {
                $userSkills = [$userSkills];
            }
            
            foreach ($userSkills as $skill) {
                CandidatesSkill::create([
                    'user_id' => $user->id,
                    'skill_name' => $skill,
                    'certificate_file' => rand(0, 1) ? 'certificates/' . str_replace(' ', '_', strtolower($skill)) . '_certificate.pdf' : null,
                ]);
            }
        }
    }
} 