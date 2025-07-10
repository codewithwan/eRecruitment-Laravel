import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';

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
        questionPack?: { id: number; pack_name: string };
        educationLevel?: { id: number; name: string };
        vacancyType?: { id: number; name: string };
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
            return format(parseISO(dateString), 'dd/MM/yyyy');
        } catch {
            return dateString;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View Job - ${job.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">View Job</h2>
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

                <Card>
                    <CardHeader>
                        <CardTitle>{job.title}</CardTitle>
                        <CardDescription>
                            {job.department?.name} • {job.location}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                                    <dl className="space-y-2">
                                        <div className="flex justify-between">
                                            <dt className="font-medium">Company:</dt>
                                            <dd>{job.company?.name || 'Not specified'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium">Department:</dt>
                                            <dd>{job.department?.name || 'Not specified'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium">Location:</dt>
                                            <dd>{job.location}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium">Salary:</dt>
                                            <dd>{job.salary || 'Not specified'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium">Vacancy Type:</dt>
                                            <dd>{job.vacancyType?.name || 'Not specified'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium">Major:</dt>
                                            <dd>{job.major?.name || 'Not specified'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium">Education Level:</dt>
                                            <dd>{job.educationLevel?.name || 'Not specified'}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium">Question Pack:</dt>
                                            <dd>{job.questionPack?.pack_name || 'None'}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                                    <p className="text-gray-600">{job.job_description || 'No description provided.'}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                                    <ul className="list-disc pl-5 space-y-1">
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
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {Array.isArray(job.benefits) ? (
                                                job.benefits.map((benefit, index) => (
                                                    <li key={index}>{benefit}</li>
                                                ))
                                            ) : (
                                                <li>{job.benefits}</li>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                                    <dl className="space-y-2">
                                        <div className="flex justify-between">
                                            <dt className="font-medium">Created:</dt>
                                            <dd>{formatDate(job.created_at)}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="font-medium">Last Updated:</dt>
                                            <dd>{formatDate(job.updated_at)}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 