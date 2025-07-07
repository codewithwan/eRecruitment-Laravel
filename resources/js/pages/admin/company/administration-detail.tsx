import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CandidateProfile {
    full_name: string;
    phone: string;
    address: string;
    birth_place: string;
    birth_date: string;
    gender: string;
}

interface Education {
    level: string | null;
    institution: string;
    faculty: string;
    major: string | null;
    start_year: string;
    end_year: string | null;
    gpa: string;
}

interface WorkExperience {
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    description: string;
}

interface Skill {
    name: string;
    level: string;
}

interface Language {
    name: string;
    proficiency: string;
}

interface Course {
    name: string;
    institution: string;
    completion_date: string;
    description: string;
}

interface Certification {
    name: string;
    issuer: string;
    date: string;
    expiry_date: string;
    credential_id: string;
}

interface Organization {
    name: string;
    position: string;
    start_year: string;
    end_year: string;
    description: string;
}

interface Achievement {
    title: string;
    issuer: string;
    date: string;
    description: string;
}

interface SocialMedia {
    platform: string;
    url: string;
}

interface CV {
    path: string;
    uploaded_at: string;
}

interface Candidate {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        profile: CandidateProfile;
        education: Education[];
        work_experiences: WorkExperience[];
        skills: Skill[];
        languages: Language[];
        courses: Course[];
        certifications: Certification[];
        organizations: Organization[];
        achievements: Achievement[];
        social_media: SocialMedia[];
        cv: CV;
    };
    vacancy: {
        id: number;
        title: string;
        company: {
            id: number;
            name: string;
        };
        period: {
            id: number;
            name: string;
            start_time: string;
            end_time: string;
        };
    };
    status: {
        id: number;
        name: string;
        code: string;
    };
    history: Array<{
        id: number;
        status: {
            name: string;
            code: string;
        };
        notes: string;
        score: number;
        processed_at: string;
        scheduled_at: string;
        completed_at: string;
        reviewer: {
            id: number;
            name: string;
            email: string;
        } | null;
    }>;
    applied_at: string;
}

interface Props {
    candidate: Candidate;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Administration', href: '/dashboard/recruitment/administration' },
    { title: 'Candidate Detail', href: '#' },
];

export default function AdministrationDetail({ candidate }: Props) {
    const formatDate = (date: string) => {
        return format(new Date(date), 'dd MMMM yyyy');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Candidate Detail" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header with back button */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.get('/dashboard/recruitment/administration')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h2 className="text-2xl font-semibold">{candidate.user.name}</h2>
                            <p className="text-sm text-muted-foreground">
                                Applied for {candidate.vacancy.title} at {candidate.vacancy.company.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant={candidate.status.code === 'approved' ? 'secondary' : 
                                     candidate.status.code === 'rejected' ? 'destructive' : 'default'}>
                            {candidate.status.name}
                        </Badge>
                        {candidate.user.cv && (
                            <Button variant="outline" size="sm" onClick={() => window.open(candidate.user.cv.path)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download CV
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-2 gap-4">
                                <div>
                                    <dt className="font-medium">Full Name</dt>
                                    <dd>{candidate.user.profile?.full_name || candidate.user.name}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium">Email</dt>
                                    <dd>{candidate.user.email}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium">Phone</dt>
                                    <dd>{candidate.user.profile?.phone || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium">Address</dt>
                                    <dd>{candidate.user.profile?.address || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium">Birth Place & Date</dt>
                                    <dd>
                                        {candidate.user.profile?.birth_place || '-'}, {' '}
                                        {candidate.user.profile?.birth_date ? 
                                            formatDate(candidate.user.profile.birth_date) : '-'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-medium">Gender</dt>
                                    <dd>{candidate.user.profile?.gender || '-'}</dd>
                                </div>
                            </dl>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <h4 className="font-medium">Social Media</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {candidate.user.social_media?.map((social, index) => (
                                        <a 
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {social.platform}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Education */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Education</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {candidate.user.education?.map((edu, index) => (
                                    <div key={index} className="space-y-2">
                                        <h4 className="font-medium">{edu.institution}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {edu.level || 'Unknown'} - {edu.faculty}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {edu.major || 'General'} • {edu.start_year} - {edu.end_year || 'Present'} • GPA: {edu.gpa}
                                        </p>
                                        {index < candidate.user.education.length - 1 && (
                                            <Separator className="my-4" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills & Languages */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Skills & Languages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="mb-4 font-medium">Skills</h4>
                                    <div className="space-y-2">
                                        {candidate.user.skills?.map((skill, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span>{skill.name}</span>
                                                <span className="text-muted-foreground">{skill.level}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="mb-4 font-medium">Languages</h4>
                                    <div className="space-y-2">
                                        {candidate.user.languages?.map((language, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span>{language.name}</span>
                                                <span className="text-muted-foreground">{language.proficiency}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Work Experience */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Work Experience</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {candidate.user.work_experiences?.map((exp, index) => (
                                    <div key={index} className="space-y-2">
                                        <h4 className="font-medium">{exp.position}</h4>
                                        <p className="text-muted-foreground">{exp.company}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                                        </p>
                                        <p className="text-sm">{exp.description}</p>
                                        {index < candidate.user.work_experiences.length - 1 && (
                                            <Separator className="my-4" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Certifications & Courses */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Certifications & Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="mb-4 font-medium">Certifications</h4>
                                    <div className="space-y-4">
                                        {candidate.user.certifications?.map((cert, index) => (
                                            <div key={index} className="space-y-1">
                                                <h5 className="font-medium">{cert.name}</h5>
                                                <p className="text-sm text-muted-foreground">
                                                    {cert.issuer} • {formatDate(cert.date)}
                                                    {cert.expiry_date && ` - ${formatDate(cert.expiry_date)}`}
                                                </p>
                                                {cert.credential_id && (
                                                    <p className="text-sm">Credential ID: {cert.credential_id}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="mb-4 font-medium">Courses</h4>
                                    <div className="space-y-4">
                                        {candidate.user.courses?.map((course, index) => (
                                            <div key={index} className="space-y-1">
                                                <h5 className="font-medium">{course.name}</h5>
                                                <p className="text-sm text-muted-foreground">
                                                    {course.institution} • Completed {formatDate(course.completion_date)}
                                                </p>
                                                <p className="text-sm">{course.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Organizations & Achievements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Organizations & Achievements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="mb-4 font-medium">Organizations</h4>
                                    <div className="space-y-4">
                                        {candidate.user.organizations?.map((org, index) => (
                                            <div key={index} className="space-y-1">
                                                <h5 className="font-medium">{org.name}</h5>
                                                <p className="text-sm text-muted-foreground">
                                                    {org.position} • {org.start_year} - {org.end_year}
                                                </p>
                                                <p className="text-sm">{org.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h4 className="mb-4 font-medium">Achievements</h4>
                                    <div className="space-y-4">
                                        {candidate.user.achievements?.map((achievement, index) => (
                                            <div key={index} className="space-y-1">
                                                <h5 className="font-medium">{achievement.title}</h5>
                                                <p className="text-sm text-muted-foreground">
                                                    {achievement.issuer} • {formatDate(achievement.date)}
                                                </p>
                                                <p className="text-sm">{achievement.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Application History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Application History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {candidate.history.map((record, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium">{record.status.name}</h4>
                                            <Badge variant={
                                                record.status.code === 'approved' ? 'secondary' :
                                                record.status.code === 'rejected' ? 'destructive' :
                                                'default'
                                            }>
                                                {record.status.code}
                                            </Badge>
                                        </div>
                                        {record.reviewer && (
                                            <p className="text-sm text-muted-foreground">
                                                Reviewed by {record.reviewer.name}
                                            </p>
                                        )}
                                        {record.notes && (
                                            <p className="text-sm">{record.notes}</p>
                                        )}
                                        <div className="flex gap-4 text-sm text-muted-foreground">
                                            {record.processed_at && (
                                                <span>Processed: {formatDate(record.processed_at)}</span>
                                            )}
                                            {record.scheduled_at && (
                                                <span>Scheduled: {formatDate(record.scheduled_at)}</span>
                                            )}
                                            {record.completed_at && (
                                                <span>Completed: {formatDate(record.completed_at)}</span>
                                            )}
                                        </div>
                                        {index < candidate.history.length - 1 && (
                                            <Separator className="my-4" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 