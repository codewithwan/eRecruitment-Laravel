import { JobTable, type Job } from '@/components/job-table';
import { SearchBar } from '@/components/searchbar';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';


interface JobProps {
    vacancies: Job[];
    companies: { id: number; name: string }[];
    departments: { id: number; name: string }[];
    majors: { id: number; name: string }[];
    questionPacks: { id: number; pack_name: string; description?: string; test_type?: string; duration?: number }[];
    educationLevels: { id: number; name: string }[];
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
];

// Helper function to ensure array format
const ensureArray = (value: any): string[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return value.split('\n').filter(item => item.trim() !== '');
    return [];
};

// Helper function to get array as string for forms
const getArrayAsString = (value: any): string => {
    if (Array.isArray(value)) return value.join('\n');
    if (typeof value === 'string') return value;
    return '';
};

export default function Jobs(props: JobProps) {
    const jobs = props.vacancies || [];
    const companies = props.companies || [];
    const departments = props.departments || [];
    const majors = props.majors || [];
    const educationLevels = props.educationLevels || [];
    
    // Debug data yang diterima
    console.log('Props data:', {
        jobs: jobs.length,
        companies: companies.length,
        departments: departments.length,
        majors: majors.length,
        educationLevels: educationLevels.length,
        departments_sample: departments.slice(0, 3),
        majors_sample: majors.slice(0, 3)
    });
    const [jobsList, setJobsList] = useState<Job[]>(jobs);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [jobIdToDelete, setJobIdToDelete] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [isFilterActive, setIsFilterActive] = useState(false);

    // Get unique departments and locations for filters
    const departmentNames = ['all', ...Array.from(new Set(jobs.map((job) => job.departement?.name).filter((name): name is string => Boolean(name))))];
    const locations = ['all', ...Array.from(new Set(jobs.map((job) => job.location)))];

    // New job form state
    const [newJob, setNewJob] = useState({
        title: '',
        department_id: '',
        major_id: 'none',
        location: '',
        salary: '',
        company_id: '',
        education_level_id: 'none',
        requirements: '',
        benefits: '',
        question_pack_id: 'none',
    });

    // Edit job form state
    const [editJob, setEditJob] = useState({
        id: 0,
        title: '',
        department_id: '',
        major_id: '',
        location: '',
        salary: '',
        company_id: '',
        education_level_id: '',
        requirements: '',
        benefits: '',
        question_pack_id: '',
    });

    // Apply filters whenever filter states change
    useEffect(() => {
        let result = jobsList;

        // Apply search filter
        if (searchQuery) {
            result = result.filter(
                (job) =>
                    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (job.departement?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Apply department filter
        if (departmentFilter && departmentFilter !== 'all') {
            result = result.filter((job) => job.departement?.name === departmentFilter);
        }

        // Apply location filter
        if (locationFilter && locationFilter !== 'all') {
            result = result.filter((job) => job.location === locationFilter);
        }

        setFilteredJobs(result);

        // Set filter active state
        setIsFilterActive(searchQuery !== '' || departmentFilter !== 'all' || locationFilter !== 'all');
    }, [searchQuery, departmentFilter, locationFilter, jobsList]);

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
                department_id: String(job.department_id || ''),
                major_id: job.major_id ? String(job.major_id) : 'none',
                location: job.location,
                salary: job.salary || '',
                company_id: String(job.company_id || ''),
                education_level_id: job.education_level_id ? String(job.education_level_id) : 'none',
                requirements: getArrayAsString(job.requirements),
                benefits: getArrayAsString(job.benefits),
                question_pack_id: job.question_pack_id ? String(job.question_pack_id) : 'none',
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

    const handleCreateJobChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewJob((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleEditJobChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditJob((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleCreateJob = async () => {
        setIsLoading(true);
        try {
            // Better data validation and formatting
            const requirementsArray = newJob.requirements.split('\n').filter((req) => req.trim() !== '');
            const benefitsArray = newJob.benefits ? newJob.benefits.split('\n').filter((ben) => ben.trim() !== '') : [];
            
            // Validate requirements array is not empty
            if (requirementsArray.length === 0) {
                console.error('Requirements cannot be empty');
                alert('Please add at least one requirement');
                setIsLoading(false);
                return;
            }
            
            // Ensure company_id is valid
            const companyId = newJob.company_id ? parseInt(newJob.company_id) : null;
            if (!companyId || isNaN(companyId)) {
                console.error('Invalid company_id:', newJob.company_id);
                alert('Please select a company');
                setIsLoading(false);
                return;
            }
            
            // Handle question_pack_id properly
            let questionPackId = null;
            if (newJob.question_pack_id && newJob.question_pack_id !== 'none') {
                questionPackId = parseInt(newJob.question_pack_id);
                if (isNaN(questionPackId)) {
                    questionPackId = null;
                }
            }
            
            const formattedData = {
                title: newJob.title.trim(),
                department_id: parseInt(newJob.department_id),
                major_id: (newJob.major_id && newJob.major_id !== 'none') ? parseInt(newJob.major_id) : null,
                location: newJob.location.trim(),
                salary: newJob.salary.trim() || null,
                company_id: companyId,
                education_level_id: (newJob.education_level_id && newJob.education_level_id !== 'none') ? parseInt(newJob.education_level_id) : null,
                requirements: requirementsArray,
                benefits: benefitsArray.length > 0 ? benefitsArray : null,
                question_pack_id: questionPackId,
            };
            
            const response = await axios.post('/dashboard/jobs', formattedData);
            setJobsList((prevJobs) => [...prevJobs, response.data.job]);
            setIsCreateDialogOpen(false);
            setNewJob({
                title: '',
                department_id: '',
                major_id: 'none',
                location: '',
                salary: '',
                company_id: '',
                education_level_id: 'none',
                requirements: '',
                benefits: '',
                question_pack_id: 'none',
            });
        } catch (error) {
            console.error('Error creating job:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                console.error('Error response:', axiosError.response?.data);
                console.error('Error status:', axiosError.response?.status);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateJob = async () => {
        setIsLoading(true);
        try {
            // Better data validation and formatting
            const requirementsArray = editJob.requirements.split('\n').filter((req) => req.trim() !== '');
            const benefitsArray = editJob.benefits ? editJob.benefits.split('\n').filter((ben) => ben.trim() !== '') : [];
            
            // Validate requirements array is not empty
            if (requirementsArray.length === 0) {
                console.error('Requirements cannot be empty');
                alert('Please add at least one requirement');
                setIsLoading(false);
                return;
            }
            
            // Ensure company_id is valid
            const companyId = editJob.company_id ? parseInt(editJob.company_id) : null;
            if (!companyId || isNaN(companyId)) {
                console.error('Invalid company_id:', editJob.company_id);
                alert('Please select a company');
                setIsLoading(false);
                return;
            }
            
            // Handle question_pack_id properly
            let questionPackId = null;
            if (editJob.question_pack_id && editJob.question_pack_id !== 'none') {
                questionPackId = parseInt(editJob.question_pack_id);
                if (isNaN(questionPackId)) {
                    questionPackId = null;
                }
            }
            
            const formattedData = {
                title: editJob.title.trim(),
                department_id: parseInt(editJob.department_id),
                major_id: (editJob.major_id && editJob.major_id !== 'none') ? parseInt(editJob.major_id) : null,
                location: editJob.location.trim(),
                salary: editJob.salary.trim() || null,
                company_id: companyId,
                education_level_id: (editJob.education_level_id && editJob.education_level_id !== 'none') ? parseInt(editJob.education_level_id) : null,
                requirements: requirementsArray,
                benefits: benefitsArray.length > 0 ? benefitsArray : null,
                question_pack_id: questionPackId,
            };

            const response = await axios.put(`/dashboard/jobs/${editJob.id}`, formattedData);
            const updatedJob = response.data.job;

            setJobsList((prevJobs) => prevJobs.map((job) => (job.id === editJob.id ? updatedJob : job)));
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error('Error updating job:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                console.error('Error response:', axiosError.response?.data);
                console.error('Error status:', axiosError.response?.status);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setDepartmentFilter('all');
        setLocationFilter('all');
    };

    // Helper function to format dates
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        try {
            return format(parseISO(dateString), 'dd/MM/yyyy');
        } catch (error) {
            return dateString; // Return original if parsing fails
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Job Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Job Management</h2>
                        <div className="flex items-center gap-2">
                            <div className="relative flex items-center"></div>
                            <Button className="px-6" onClick={handleAddJob}>
                                + Add Job
                            </Button>
                        </div>
                    </div>
                    <Card>
                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Jobs List</CardTitle>
                            <CardDescription>Manage all jobs in the system</CardDescription>
                        </div>

                        <div className="flex items-center gap-4">
                            <SearchBar
                            icon={<Search className="w-4 h-4" />}
                            placeholder="Cari user..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                            <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={isFilterActive ? 'default' : 'outline'}
                                size="icon"
                                className="relative"
                                >
                                <Filter className="h-4 w-4" />
                                {isFilterActive && (
                                    <span className="bg-primary absolute -top-1 -right-1 h-2 w-2 rounded-full"></span>
                                )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="space-y-4">
                                    <h4 className="font-medium">Filters</h4>
                                    <div className="space-y-2">
                                        <Label htmlFor="department-filter">Department</Label>
                                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                            <SelectTrigger id="department-filter">
                                                <SelectValue placeholder="Filter by department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departmentNames.map((dept) => (
                                                    <SelectItem key={dept} value={dept}>
                                                        {dept === 'all' ? 'All Departments' : dept}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location-filter">Location</Label>
                                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                                            <SelectTrigger id="location-filter">
                                                <SelectValue placeholder="Filter by location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map((loc) => (
                                                    <SelectItem key={loc} value={loc}>
                                                        {loc === 'all' ? 'All Locations' : loc}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs">
                                            Reset Filters
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                            </Popover>
                        </div>
                        </CardHeader>
                        <CardContent>
                            {/* Keep the rest of the JobTable component */}
                            <JobTable jobs={filteredJobs} onView={handleViewJob} onEdit={handleEditJob} onDelete={handleDeleteJob} />
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
                            <Input 
                                id="title" 
                                name="title" 
                                placeholder="Enter job title"
                                value={newJob.title} 
                                onChange={handleCreateJobChange} 
                            />
                        </div>
                        <div>
                            <Label htmlFor="create-department-id">Department</Label>
                            <Select name="department_id" value={newJob.department_id} onValueChange={(value) => setNewJob(prev => ({ ...prev, department_id: value }))}>
                                <SelectTrigger id="create-department-id">
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((department) => (
                                        <SelectItem key={department.id} value={String(department.id)}>
                                            {department.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="create-major-id">Major</Label>
                            <Select name="major_id" value={newJob.major_id} onValueChange={(value) => setNewJob(prev => ({ ...prev, major_id: value }))}>
                                <SelectTrigger id="create-major-id">
                                    <SelectValue placeholder="Select major" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {majors.map((major) => (
                                        <SelectItem key={major.id} value={String(major.id)}>
                                            {major.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input 
                                id="location" 
                                name="location" 
                                placeholder="Enter job location"
                                value={newJob.location} 
                                onChange={handleCreateJobChange} 
                            />
                        </div>
                        <div>
                            <Label htmlFor="salary">Salary</Label>
                            <Input 
                                id="salary" 
                                name="salary" 
                                placeholder="Enter salary range or amount"
                                value={newJob.salary} 
                                onChange={handleCreateJobChange} 
                            />
                        </div>
                        <div>
                            <Label htmlFor="create-company-id">Company</Label>
                            <Select name="company_id" value={newJob.company_id} onValueChange={(value) => setNewJob(prev => ({ ...prev, company_id: value }))}>
                                <SelectTrigger id="create-company-id">
                                    <SelectValue placeholder="Select company" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companies.map((company) => (
                                        <SelectItem key={company.id} value={String(company.id)}>
                                            {company.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="create-question-pack-id">Question Pack</Label>
                            <Select name="question_pack_id" value={newJob.question_pack_id} onValueChange={(value) => setNewJob(prev => ({ ...prev, question_pack_id: value }))}>
                                <SelectTrigger id="create-question-pack-id">
                                    <SelectValue placeholder="Select question pack" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {props.questionPacks.map((pack) => (
                                        <SelectItem key={pack.id} value={String(pack.id)}>
                                            {pack.pack_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="create-education-level-id">Education Level</Label>
                            <Select name="education_level_id" value={newJob.education_level_id} onValueChange={(value) => setNewJob(prev => ({ ...prev, education_level_id: value }))}>
                                <SelectTrigger id="create-education-level-id">
                                    <SelectValue placeholder="Select education level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {educationLevels.map((level) => (
                                        <SelectItem key={level.id} value={String(level.id)}>
                                            {level.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="requirements">Requirements (one per line)</Label>
                            <Textarea 
                                id="requirements" 
                                name="requirements" 
                                placeholder="Enter job requirements"
                                value={newJob.requirements} 
                                onChange={handleCreateJobChange} 
                                rows={4} 
                            />
                        </div>
                        <div>
                            <Label htmlFor="benefits">Benefits (one per line, optional)</Label>
                            <Textarea 
                                id="benefits" 
                                name="benefits" 
                                placeholder="Enter job benefits"
                                value={newJob.benefits} 
                                onChange={handleCreateJobChange} 
                                rows={4} 
                            />
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
                            <Label htmlFor="edit-department-id">Department</Label>
                            <Select name="department_id" value={editJob.department_id} onValueChange={(value) => setEditJob(prev => ({ ...prev, department_id: value }))}>
                                <SelectTrigger id="edit-department-id">
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((department) => (
                                        <SelectItem key={department.id} value={String(department.id)}>
                                            {department.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="edit-major-id">Major</Label>
                            <Select name="major_id" value={editJob.major_id} onValueChange={(value) => setEditJob(prev => ({ ...prev, major_id: value }))}>
                                <SelectTrigger id="edit-major-id">
                                    <SelectValue placeholder="Select major" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {majors.map((major) => (
                                        <SelectItem key={major.id} value={String(major.id)}>
                                            {major.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="edit-location">Location</Label>
                            <Input id="edit-location" name="location" value={editJob.location} onChange={handleEditJobChange} />
                        </div>
                        <div>
                            <Label htmlFor="edit-salary">Salary</Label>
                            <Input 
                                id="edit-salary" 
                                name="salary" 
                                placeholder="Enter salary range or amount"
                                value={editJob.salary} 
                                onChange={handleEditJobChange} 
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-company-id">Company</Label>
                            <Select name="company_id" value={String(editJob.company_id)} onValueChange={(value) => setEditJob(prev => ({ ...prev, company_id: value }))}>
                                <SelectTrigger id="edit-company-id">
                                    <SelectValue placeholder="Select company" />
                                </SelectTrigger>
                                <SelectContent>
                                    {companies.map((company) => (
                                        <SelectItem key={company.id} value={String(company.id)}>
                                            {company.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="edit-question-pack-id">Question Pack</Label>
                            <Select name="question_pack_id" value={editJob.question_pack_id} onValueChange={(value) => setEditJob(prev => ({ ...prev, question_pack_id: value }))}>
                                <SelectTrigger id="edit-question-pack-id">
                                    <SelectValue placeholder="Select question pack" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {props.questionPacks.map((pack) => (
                                        <SelectItem key={pack.id} value={String(pack.id)}>
                                            {pack.pack_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="edit-education-level-id">Education Level</Label>
                            <Select name="education_level_id" value={editJob.education_level_id} onValueChange={(value) => setEditJob(prev => ({ ...prev, education_level_id: value }))}>
                                <SelectTrigger id="edit-education-level-id">
                                    <SelectValue placeholder="Select education level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {educationLevels.map((level) => (
                                        <SelectItem key={level.id} value={String(level.id)}>
                                            {level.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                <div className="col-span-2">{selectedJob.departement?.name || 'Not specified'}</div>

                                <div className="font-medium">Major:</div>
                                <div className="col-span-2">{selectedJob.major?.name || 'Not specified'}</div>

                                <div className="font-medium">Location:</div>
                                <div className="col-span-2">{selectedJob.location}</div>

                                <div className="font-medium">Salary:</div>
                                <div className="col-span-2">{selectedJob.salary || 'Not specified'}</div>

                                <div className="font-medium">Company:</div>
                                <div className="col-span-2">{companies.find(company => company.id === selectedJob.company_id)?.name}</div>

                                <div className="font-medium">Question Pack:</div>
                                <div className="col-span-2">
                                    {selectedJob.questionPack ? selectedJob.questionPack.pack_name : 'None'}
                                </div>

                                <div className="font-medium">Requirements:</div>
                                <div className="col-span-2">
                                    <ul className="list-disc pl-5">
                                        {ensureArray(selectedJob.requirements).map((req, index) => (
                                            <li key={`req-${index}`}>{req}</li>
                                        ))}
                                    </ul>
                                </div>

                                {selectedJob.benefits && ensureArray(selectedJob.benefits).length > 0 && (
                                    <>
                                        <div className="font-medium">Benefits:</div>
                                        <div className="col-span-2">
                                            <ul className="list-disc pl-5">
                                                {ensureArray(selectedJob.benefits).map((benefit, index) => (
                                                    <li key={`benefit-${index}`}>{benefit}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}

                                <div className="font-medium">Created:</div>
                                <div className="col-span-2">{formatDate(selectedJob.created_at)}</div>
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
