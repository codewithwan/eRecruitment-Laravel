import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { Building2, MapPin, GraduationCap, Briefcase, Calendar, ClipboardList, BadgeCheck } from 'lucide-react';

interface JobProps {
    job: {
        id: number;
        title: string;
        department?: { id: number; name: string };
        major?: { id: number; name: string };
        location: string;
        salary?: string;
        company?: { id: number; name: string };
        requirements: string[] | string;
        benefits?: string[] | string;
        question_pack?: { id: number; pack_name: string };
        education_level?: { id: number; name: string };
        vacancy_type?: { id: number; name: string };
        job_description?: string;
        created_at?: string;
        updated_at?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Job Management',
        href: '/dashboard/jobs',
    },
    {
        title: 'View Job',
        href: '#',
    },
];

export default function ViewJob({ job }: JobProps) {
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        try {
            return format(parseISO(dateString), 'dd MMMM yyyy');
        } catch {
            return dateString;
        }
    };

    const formatSalary = (salary: string | undefined) => {
        if (!salary) return 'Not specified';
        // Keep the original format but add proper currency formatting
        const parts = salary.split('-').map(part => {
            const number = Number(part.replace(/[^0-9]/g, ''));
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(number);
        });
        return parts.join(' - ');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View Job - ${job.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{job.title}</h2>
                        <p className="text-muted-foreground mt-2 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {job.company?.name || 'Company not specified'}
                            <span className="mx-2">•</span>
                            <MapPin className="h-4 w-4" />
                            {job.location}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route('admin.jobs.index'))}
                        >
                            Back to List
                        </Button>
                        <Button
                            onClick={() => router.visit(route('admin.jobs.edit', { id: job.id }))}
                        >
                            Edit Job
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Job Details</CardTitle>
                            <CardDescription>Detailed information about the job position</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-4">Job Description</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {job.job_description || 'No description provided.'}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold mb-4">Requirements</h3>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                    {Array.isArray(job.requirements) ? (
                                        job.requirements.map((req, index) => (
                                            <li key={index}>{req}</li>
                                        ))
                                    ) : (
                                        <li>{job.requirements || 'No requirements specified'}</li>
                                    )}
                                </ul>
                            </div>

                            {job.benefits && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="font-semibold mb-4">Benefits</h3>
                                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                            {Array.isArray(job.benefits) ? (
                                                job.benefits.map((benefit, index) => (
                                                    <li key={index}>{benefit}</li>
                                                ))
                                            ) : (
                                                <li>{job.benefits}</li>
                                            )}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Department</p>
                                        <p className="text-sm text-muted-foreground">
                                            {job.department?.name || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Education & Major</p>
                                        <p className="text-sm text-muted-foreground">
                                            {job.education_level?.name || 'Not specified'} • {job.major?.name || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Vacancy Type</p>
                                        <p className="text-sm text-muted-foreground">
                                            {job.vacancy_type?.name || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium mb-1">Salary Range</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatSalary(job.salary)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Question Pack</p>
                                        <p className="text-sm text-muted-foreground">
                                            {job.question_pack?.pack_name || 'No question pack assigned'}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Created</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(job.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Last Updated</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(job.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 