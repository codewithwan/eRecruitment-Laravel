import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Edit, PlusCircle, Upload } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Candidate',
        href: '/candidate',
    },
    {
        title: 'Candidate Profile',
        href: '/candidate/profile',
    },
];

export default function CandidateProfile() {
    // Mock data - in a real app this would come from props or an API
    const [profile] = useState({
        personalInfo: {
            name: 'codewithwan',
            email: 'codewithwan@gmail.com',
            phone: '+62 812 3456 7890',
            dateOfBirth: '2004-01-01',
            gender: 'Male',
            address: 'Jl. Sudirman No. 123, Semarang',
            photo: '/path/to/avatar.jpg',
            nationality: 'Indonesian',
            maritalStatus: 'Single',
            identityNo: '1234567890123456', // KTP number
        },
        education: [
            {
                institution: 'State Polytechnic of Semarang',
                degree: 'Bachelor of Computer Science',
                field: 'Computer Science',
                startDate: '2023',
                endDate: '2026',
                gpa: '3.90',
            },
        ],
        workExperience: [
            {
                company: 'Tech Solutions Inc.',
                position: 'Software Developer',
                startDate: 'Jan 2015',
                endDate: 'Dec 2018',
                description: 'Developed web applications using React and Node.js',
            },
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL'],
        languages: [
            { language: 'Indonesian', proficiency: 'Native' },
            { language: 'English', proficiency: 'Professional' },
        ],
        certifications: [
            {
                name: 'AWS Certified Developer',
                issuer: 'Amazon Web Services',
                date: 'June 2019',
                expires: 'June 2022',
            },
        ],
        documents: {
            resume: 'resume.pdf',
            coverLetter: 'cover-letter.pdf',
            certificates: ['aws-cert.pdf'],
        },
        preferences: {
            jobType: 'Full-time',
            expectedSalary: 'Rp 15.000.000 - Rp 20.000.000',
            willingToRelocate: true,
            preferredLocations: ['Jakarta', 'Bandung', 'Surabaya'],
        },
    });

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Candidate Profile" />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="mb-4 text-2xl font-semibold">Profile</h2>
                        <p className="text-muted-foreground">Manage your personal information and career preferences</p>
                    </div>
                    <Button>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                </div>

                {/* Personal Information Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Your basic details and contact information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-8 md:flex-row">
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="h-40 w-40">
                                    <AvatarImage src={profile.personalInfo.photo} alt="Profile" />
                                    <AvatarFallback className="text-3xl">{profile.personalInfo.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Button variant="outline" size="sm">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Change Photo
                                </Button>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-sm font-medium">Full Name</p>
                                        <p>{profile.personalInfo.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-sm font-medium">Email</p>
                                        <p>{profile.personalInfo.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-sm font-medium">Phone Number</p>
                                        <p>{profile.personalInfo.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-sm font-medium">Date of Birth</p>
                                        <p>{profile.personalInfo.dateOfBirth}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-sm font-medium">Gender</p>
                                        <p>{profile.personalInfo.gender}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-sm font-medium">Nationality</p>
                                        <p>{profile.personalInfo.nationality}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-sm font-medium">ID Number (KTP)</p>
                                        <p>{profile.personalInfo.identityNo}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-sm font-medium">Marital Status</p>
                                        <p>{profile.personalInfo.maritalStatus}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm font-medium">Address</p>
                                    <p>{profile.personalInfo.address}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Education Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Education</CardTitle>
                            <CardDescription>Your academic background and qualifications</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Education
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {profile.education.map((edu, index) => (
                                <div key={index} className={index > 0 ? 'border-t pt-6' : ''}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold">{edu.institution}</h3>
                                            <p className="text-muted-foreground text-sm">
                                                {edu.degree} in {edu.field}
                                            </p>
                                            <p className="text-muted-foreground text-sm">
                                                {edu.startDate} - {edu.endDate}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="mt-2 text-sm">GPA: {edu.gpa}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Work Experience Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Work Experience</CardTitle>
                            <CardDescription>Your professional history and roles</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Experience
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {profile.workExperience.map((work, index) => (
                                <div key={index} className={index > 0 ? 'border-t pt-6' : ''}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold">{work.position}</h3>
                                            <p className="text-muted-foreground text-sm">{work.company}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {work.startDate} - {work.endDate}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="mt-2 text-sm">{work.description}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Skills Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Skills</CardTitle>
                                <CardDescription>Your technical and professional abilities</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Skill
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Languages Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Languages</CardTitle>
                                <CardDescription>Languages you speak or write</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Language
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {profile.languages.map((lang, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span>{lang.language}</span>
                                        <Badge variant="outline">{lang.proficiency}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Certifications Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Certifications</CardTitle>
                            <CardDescription>Professional certifications and credentials</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Certification
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {profile.certifications.map((cert, index) => (
                                <div key={index} className={index > 0 ? 'border-t pt-6' : ''}>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold">{cert.name}</h3>
                                            <p className="text-muted-foreground text-sm">Issued by {cert.issuer}</p>
                                            <p className="text-muted-foreground text-sm">
                                                Issued: {cert.date} • Expires: {cert.expires}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Documents Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Documents</CardTitle>
                        <CardDescription>Resumes, cover letters, and certificates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Resume</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground text-sm">{profile.documents.resume || 'No file uploaded'}</CardContent>
                                <CardFooter className="pt-0">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Resume
                                    </Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Cover Letter</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground text-sm">
                                    {profile.documents.coverLetter || 'No file uploaded'}
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Cover Letter
                                    </Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Certificates</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground text-sm">
                                    {profile.documents.certificates.length > 0
                                        ? `${profile.documents.certificates.length} files uploaded`
                                        : 'No files uploaded'}
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Certificates
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                {/* Job Preferences Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Job Preferences</CardTitle>
                        <CardDescription>Your career goals and requirements</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm font-medium">Job Type</p>
                                <p>{profile.preferences.jobType}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm font-medium">Expected Salary</p>
                                <p>{profile.preferences.expectedSalary}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm font-medium">Willing to Relocate</p>
                                <p>{profile.preferences.willingToRelocate ? 'Yes' : 'No'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground text-sm font-medium">Preferred Locations</p>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {profile.preferences.preferredLocations.map((location, index) => (
                                        <Badge key={index} variant="outline">
                                            {location}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Preferences
                        </Button>
                    </CardFooter>
                </Card>

                <div className="flex justify-end">
                    <Button size="lg">Save All Changes</Button>
                </div>
            </div>
        </UserLayout>
    );
}
