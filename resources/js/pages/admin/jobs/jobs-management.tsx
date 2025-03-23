import { JobTable, type Job } from '@/components/job-table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

interface JobProps {
    vacancies: Job[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Jobs Management',
        href: '/dashboard/jobs',
    },
];

export default function Jobs(props: JobProps) {
    const jobs = props.vacancies || [];
    const [jobsList, setJobsList] = useState<Job[]>(jobs);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [jobIdToDelete, setJobIdToDelete] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // New job form state
    const [newJob, setNewJob] = useState({
        title: '',
        department: '',
        location: '',
        requirements: '',
        benefits: '',
    });

    // Edit job form state
    const [editJob, setEditJob] = useState({
        id: 0,
        title: '',
        department: '',
        location: '',
        requirements: '',
        benefits: '',
    });

    const handleViewJob = (jobId: number) => {
        const job = jobsList.find((job) => job.id === jobId);
        if (job) {
            setSelectedJob(job);
            setIsViewDialogOpen(true);
        }
    };

    const handleEditJob = (jobId: number) => {
        const job = jobsList.find((job) => job.id === jobId);
        if (job) {
            setEditJob({
                id: job.id,
                title: job.title,
                department: job.department,
                location: job.location,
                requirements: job.requirements.join('\n'),
                benefits: job.benefits ? job.benefits.join('\n') : '',
            });
            setIsEditDialogOpen(true);
        }
    };

    const handleDeleteJob = (jobId: number) => {
        setJobIdToDelete(jobId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteJob = async () => {
        if (jobIdToDelete === null) return;

        setIsLoading(true);
        try {
            await axios.delete(`/dashboard/jobs/${jobIdToDelete}`);
            setJobsList((prevJobs) => prevJobs.filter((job) => job.id !== jobIdToDelete));
        } catch (error) {
            console.error('Error deleting job:', error);
        } finally {
            setIsLoading(false);
            setIsDeleteDialogOpen(false);
            setJobIdToDelete(null);
        }
    };

    const handleAddJob = () => {
        setIsCreateDialogOpen(true);
    };

    const handleCreateJobChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewJob((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleEditJobChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditJob((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleCreateJob = async () => {
        setIsLoading(true);
        try {
            const formattedData = {
                ...newJob,
                requirements: newJob.requirements.split('\n').filter((req) => req.trim() !== ''),
                benefits: newJob.benefits ? newJob.benefits.split('\n').filter((ben) => ben.trim() !== '') : null,
            };
            console.log('formattedData', formattedData);
            const response = await axios.post('/dashboard/jobs', formattedData);
            console.log('response', response);
            console.log('response', response.status);
            setJobsList((prevJobs) => [...prevJobs, response.data.job]);
            setIsCreateDialogOpen(false);
            setNewJob({
                title: '',
                department: '',
                location: '',
                requirements: '',
                benefits: '',
            });
        } catch (error) {
            console.error('Error creating job:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateJob = async () => {
        setIsLoading(true);
        try {
            const formattedData = {
                ...editJob,
                requirements: editJob.requirements.split('\n').filter((req) => req.trim() !== ''),
                benefits: editJob.benefits ? editJob.benefits.split('\n').filter((ben) => ben.trim() !== '') : null,
            };

            const response = await axios.put(`/dashboard/jobs/${editJob.id}`, formattedData);
            const updatedJob = response.data.job;

            setJobsList((prevJobs) => prevJobs.map((job) => (job.id === editJob.id ? updatedJob : job)));
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error('Error updating job:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jobs Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Jobs Management</h2>
                        <Button className="mx-10 px-10" onClick={handleAddJob}>
                            Add Job
                        </Button>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Jobs List</CardTitle>
                            <CardDescription>Manage all job openings in the system</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <JobTable jobs={jobsList} onView={handleViewJob} onEdit={handleEditJob} onDelete={handleDeleteJob} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create Job Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Job</DialogTitle>
                        <DialogDescription>Fill in the details to create a new job opening.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Job Title</Label>
                            <Input id="title" name="title" value={newJob.title} onChange={handleCreateJobChange} />
                        </div>
                        <div>
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" name="department" value={newJob.department} onChange={handleCreateJobChange} />
                        </div>
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" name="location" value={newJob.location} onChange={handleCreateJobChange} />
                        </div>
                        <div>
                            <Label htmlFor="requirements">Requirements (one per line)</Label>
                            <Textarea id="requirements" name="requirements" value={newJob.requirements} onChange={handleCreateJobChange} rows={4} />
                        </div>
                        <div>
                            <Label htmlFor="benefits">Benefits (one per line, optional)</Label>
                            <Textarea id="benefits" name="benefits" value={newJob.benefits} onChange={handleCreateJobChange} rows={4} />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateJob} disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Job Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Job</DialogTitle>
                        <DialogDescription>Update the job opening details.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-title">Job Title</Label>
                            <Input id="edit-title" name="title" value={editJob.title} onChange={handleEditJobChange} />
                        </div>
                        <div>
                            <Label htmlFor="edit-department">Department</Label>
                            <Input id="edit-department" name="department" value={editJob.department} onChange={handleEditJobChange} />
                        </div>
                        <div>
                            <Label htmlFor="edit-location">Location</Label>
                            <Input id="edit-location" name="location" value={editJob.location} onChange={handleEditJobChange} />
                        </div>
                        <div>
                            <Label htmlFor="edit-requirements">Requirements (one per line)</Label>
                            <Textarea
                                id="edit-requirements"
                                name="requirements"
                                value={editJob.requirements}
                                onChange={handleEditJobChange}
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-benefits">Benefits (one per line, optional)</Label>
                            <Textarea id="edit-benefits" name="benefits" value={editJob.benefits} onChange={handleEditJobChange} rows={4} />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateJob} disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Job Detail Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Job Details</DialogTitle>
                        <DialogDescription>Detailed information about the selected job opening.</DialogDescription>
                    </DialogHeader>
                    {selectedJob && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="font-medium">Title:</div>
                                <div className="col-span-2">{selectedJob.title}</div>

                                <div className="font-medium">Department:</div>
                                <div className="col-span-2">{selectedJob.department}</div>

                                <div className="font-medium">Location:</div>
                                <div className="col-span-2">{selectedJob.location}</div>

                                <div className="font-medium">Requirements:</div>
                                <div className="col-span-2">
                                    <ul className="list-disc pl-5">
                                        {selectedJob.requirements.map((req, index) => (
                                            <li key={index}>{req}</li>
                                        ))}
                                    </ul>
                                </div>

                                {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                                    <>
                                        <div className="font-medium">Benefits:</div>
                                        <div className="col-span-2">
                                            <ul className="list-disc pl-5">
                                                {selectedJob.benefits.map((benefit, index) => (
                                                    <li key={index}>{benefit}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}

                                <div className="font-medium">Created:</div>
                                <div className="col-span-2">{new Date(selectedJob.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="sm:justify-end">
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Job Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this job? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteJob}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
