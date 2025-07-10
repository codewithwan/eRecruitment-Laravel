import { JobTable, type Job } from '@/components/job-table';
import { SearchBar } from '@/components/searchbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface JobProps {
    vacancies: Job[];
    companies: { id: number; name: string }[];
    departments: { id: number; name: string }[];
    majors: { id: number; name: string }[];
    questionPacks: { id: number; pack_name: string }[];
    educationLevels: { id: number; name: string }[];
    vacancyTypes: { id: number; name: string }[];
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

export default function Jobs(props: JobProps) {
    const jobs = props.vacancies || [];
    const [jobsList, setJobsList] = useState<Job[]>(jobs);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [isFilterActive, setIsFilterActive] = useState(false);

    // Get unique departments and locations for filters
    const departmentNames = ['all', ...Array.from(new Set(jobs.map((job) => job.department?.name).filter((name): name is string => Boolean(name))))];
    const locations = ['all', ...Array.from(new Set(jobs.map((job) => job.location)))];

    // Apply filters whenever filter states change
    useEffect(() => {
        let result = jobsList;

        // Apply search filter
        if (searchQuery) {
            result = result.filter(
                (job) =>
                    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (job.department?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Apply department filter
        if (departmentFilter && departmentFilter !== 'all') {
            result = result.filter((job) => job.department?.name === departmentFilter);
        }

        // Apply location filter
        if (locationFilter && locationFilter !== 'all') {
            result = result.filter((job) => job.location === locationFilter);
        }

        setFilteredJobs(result);
        setIsFilterActive(searchQuery !== '' || departmentFilter !== 'all' || locationFilter !== 'all');
    }, [searchQuery, departmentFilter, locationFilter, jobsList]);

    const handleView = (id: number) => {
        router.visit(route('admin.jobs.view', { id }));
    };

    const handleEdit = (id: number) => {
        router.visit(route('admin.jobs.edit', { id }));
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this job?')) {
            await router.delete(route('admin.jobs.destroy', { id }));
            setJobsList((prevJobs) => prevJobs.filter((job) => job.id !== id));
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setDepartmentFilter('all');
        setLocationFilter('all');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Job Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Job Management</h2>
                        <Button
                            onClick={() => router.visit(route('admin.jobs.create'))}
                            className="bg-blue-500 hover:bg-blue-700"
                        >
                            + Add Job
                        </Button>
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
                                    placeholder="Search jobs..."
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
                            <JobTable
                                jobs={filteredJobs}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
