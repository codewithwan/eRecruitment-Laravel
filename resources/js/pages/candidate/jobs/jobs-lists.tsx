import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UserLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface JobListsProps {
    vacancies: JobOpening[];
    user: {
        id: number;
        name: string;
        email: string;
    };
    appliedVacancyIds: number[];
    flash?: {
        success?: string;
        error?: string;
    };
}

interface JobOpening {
    id: number;
    title: string;
    department: string;
    location: string;
    requirements: string[];
    benefits?: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Candidate',
        href: '/candidate',
    },
    {
        title: 'Job Opportunities',
        href: '/candidate/jobs',
    },
];

export default function JobLists(props: JobListsProps) {
    const { vacancies, user, flash, appliedVacancyIds } = props;
    const [selectedJob, setSelectedJob] = useState<JobOpening | null>(vacancies.length > 0 ? vacancies[0] : null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { post, processing } = useForm();

    // Show toast notifications for success or error messages
    if (flash?.success) {
        toast.success('Application submitted successfully');
    }

    if (flash?.error) {
        toast.error(flash.error);
    }
    const hasApplied = (jobId: number): boolean => {
        return appliedVacancyIds.includes(jobId);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedJob) return;

        post(`/candidate/jobs/${selectedJob.id}/apply`, {
            onSuccess: () => {
                setIsDialogOpen(false);
            },
        });
    };

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Job Opportunities" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <h2 className="mb-4 text-2xl font-semibold">Job Opportunities</h2>

                <div className="flex flex-col gap-6 md:flex-row">
                    {/* Sidebar with job options */}
                    <div className="w-full rounded-xl border border-gray-100 bg-white shadow-sm md:w-1/3">
                        <div className="border-b border-gray-100 p-4">
                            <h3 className="text-lg font-medium">Available Positions</h3>
                        </div>
                        <div className="max-h-[70vh] overflow-y-auto">
                            {vacancies.map((job, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer border-b border-gray-100 p-4 transition-all hover:bg-blue-50 ${selectedJob?.id === job.id ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''}`}
                                    onClick={() => setSelectedJob(job)}
                                >
                                    <div className="flex justify-between">
                                        <h4 className="font-medium text-blue-900">{job.title}</h4>
                                        {hasApplied(job.id) && <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-600">Applied</span>}
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                        <span>{job.department}</span>
                                        <span className="mx-2">•</span>
                                        <span>{job.location}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Job details section */}
                    <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm md:w-2/3">
                        {selectedJob ? (
                            <div>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold text-blue-900">{selectedJob.title}</h2>
                                    <div className="mt-2 flex items-center text-gray-600">
                                        <span className="rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-600">{selectedJob.department}</span>
                                        <span className="mx-2">•</span>
                                        <span>{selectedJob.location}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="mb-3 text-lg font-medium">Requirements</h3>
                                    <ul className="list-inside list-disc space-y-2 text-gray-600">
                                        {Array.isArray(selectedJob.requirements) 
                                            ? selectedJob.requirements.map((req, idx) => (
                                                <li key={idx}>{req}</li>
                                              ))
                                            : typeof selectedJob.requirements === 'string'
                                              ? <li>{selectedJob.requirements}</li>
                                              : <li>No specific requirements</li>
                                        }
                                    </ul>
                                </div>

                                {selectedJob.benefits && (
                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-medium">Benefits</h3>
                                        <ul className="list-inside list-disc space-y-2 text-gray-600">
                                            {Array.isArray(selectedJob.benefits) 
                                                ? selectedJob.benefits.map((benefit, idx) => (
                                                    <li key={idx}>{benefit}</li>
                                                ))
                                                : typeof selectedJob.benefits === 'string'
                                                  ? <li>{selectedJob.benefits}</li>
                                                  : <li>No specific benefits listed</li>
                                            }
                                        </ul>
                                    </div>
                                )}

                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            className="mt-4 w-full rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 md:w-auto"
                                            disabled={hasApplied(selectedJob.id)}
                                        >
                                            {hasApplied(selectedJob.id) ? 'Already Applied' : 'Apply for this position'}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px]">
                                        <DialogHeader>
                                            <DialogTitle>Apply for {selectedJob.title}</DialogTitle>
                                            <DialogDescription>
                                                You are applying as {user.name} ({user.email}). Click submit to confirm your application.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit}>
                                            <div className="py-4 text-center">
                                                <p>Are you sure you want to apply for this position?</p>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Your profile information will be shared with the recruiting team.
                                                </p>
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit" disabled={processing}>
                                                    {processing ? 'Submitting...' : 'Submit Application'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                {hasApplied(selectedJob.id) && (
                                    <p className="mt-4 text-sm text-green-600">
                                        You have already applied for this position. We'll update you on your application status.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="flex h-64 items-center justify-center text-gray-500">Select a job to view details</div>
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
