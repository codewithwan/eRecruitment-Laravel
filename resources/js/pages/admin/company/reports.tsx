import { CompanyWizard } from '@/components/company-wizard';
import { ReportsTable } from '@/components/reports-table';
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
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePeriodCompanyInfo } from '@/hooks/usePeriodCompanyInfo';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Filter, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type ReportUser = {
    id: string;
    name: string;
    email: string;
    position: string;
    registration_date: string;
    period?: string;
    overall_score?: number;
    final_decision?: string;
    final_notes?: string;
    rejection_reason?: string;
    recommendation?: string;
    decision_made_by?: string;
    decision_made_at?: string;
    report_generated_by?: string;
    report_generated_at?: string;
    administration_score?: number;
    assessment_score?: number;
    interview_score?: number;
    stage_summary?: any;
    strengths?: string;
    weaknesses?: string;
    next_steps?: string;
};

interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Reports & Analytics',
        href: '/dashboard/company/reports',
    },
];

interface ReportsProps {
    users?: ReportUser[];
    reports?: ReportUser[];
    pagination?: PaginationData;
    statistics?: {
        total: number;
        completed: number;
        scheduled: number;
        waiting: number;
    };
    selectedPeriod?: {
        id: string;
        name: string;
        company?: string;
    };
}

export default function ReportsDashboard({ 
    users: initialUsers = [],
    reports: initialReports = [],
    pagination: initialPagination,
    statistics: backendStatistics
}: ReportsProps) {
    // Get period ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const periodId = urlParams.get('period');
    const companyIdFromUrl = urlParams.get('company');
    
    // Fetch period and company info from the API
    const { loading, error, periodInfo } = usePeriodCompanyInfo(periodId, companyIdFromUrl);
    
    // State for company and period names (either from API or fallback)
    const [companyName, setCompanyName] = useState<string>("Loading...");
    const [periodName, setPeriodName] = useState<string>("Loading...");
    
    // Update company and period names when periodInfo changes
    useEffect(() => {
        if (periodInfo) {
            setCompanyName(periodInfo.company.name);
            setPeriodName(periodInfo.period.name);
        } else if (!loading && !error && !periodInfo) {
            // Fallback if no period is selected
            setCompanyName("Select a period");
            setPeriodName("No period selected");
        } else if (error) {
            setCompanyName("Error loading data");
            setPeriodName("Error loading data");
        }
    }, [periodInfo, loading, error]);

    // Use real data from backend (reports or users prop)
    const reportUsers = initialReports.length > 0 ? initialReports : initialUsers;

    // Filter and search state
    const [filteredUsers, setFilteredUsers] = useState(reportUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [positionFilter, setPositionFilter] = useState('all');
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<ReportUser | null>(null);
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
    const [editUser, setEditUser] = useState<Partial<ReportUser>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Use statistics from backend or calculate from data as fallback
    const statistics = useMemo(() => {
        if (backendStatistics) {
            return backendStatistics;
        }
        
        // Fallback calculation if no backend statistics provided
        if (reportUsers.length === 0) {
            return {
                total: 0,
                completed: 0,
                scheduled: 0,
                waiting: 0
            };
        }

        const total = reportUsers.length;
        const completed = reportUsers.filter(user => user.final_decision === 'accepted' || user.final_decision === 'rejected').length;
        const scheduled = reportUsers.filter(user => user.final_decision === 'pending' && user.overall_score !== null).length;
        const waiting = reportUsers.filter(user => user.final_decision === 'pending' && user.overall_score === null).length;

        return {
            total,
            completed,
            scheduled,
            waiting
        };
    }, [backendStatistics, reportUsers]);

    // Real pagination based on filtered data
    const [pagination, setPagination] = useState<PaginationData>(
        initialPagination || {
            total: reportUsers.length,
            per_page: 8,
            current_page: 1,
            last_page: Math.ceil(reportUsers.length / 8),
        }
    );

    // Handler untuk pagination
    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, current_page: page }));
        // Apply pagination to current filtered data
        const startIndex = (page - 1) * pagination.per_page;
        const endIndex = startIndex + pagination.per_page;
        const paginatedData = applyFiltersToData(reportUsers).slice(startIndex, endIndex);
        setFilteredUsers(paginatedData);
    };

    // Get unique positions dynamically from the user data
    const uniquePositions = useMemo(() => {
        const positions = new Set(reportUsers.map(user => user.position));
        return Array.from(positions).sort();
    }, [reportUsers]);

    // Helper function to apply filters to data
    const applyFiltersToData = (data: ReportUser[]) => {
        let result = data;

        if (searchQuery) {
            result = result.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.position.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        if (positionFilter !== 'all') {
            result = result.filter((user) => user.position.toLowerCase() === positionFilter.toLowerCase());
        }

        return result;
    };

    // Filter users based on search and position filter
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        applyFilters(query, positionFilter);
    };

    const handlePositionFilter = (position: string) => {
        setPositionFilter(position);
        applyFilters(searchQuery, position);
    };

    const applyFilters = (query: string, position: string) => {
        const filteredData = applyFiltersToData(reportUsers);
        
        // Reset to first page when filtering
        const newPagination = {
            total: filteredData.length,
            per_page: pagination.per_page,
            current_page: 1,
            last_page: Math.ceil(filteredData.length / pagination.per_page),
        };
        
        setPagination(newPagination);
        
        // Apply pagination to filtered data
        const paginatedData = filteredData.slice(0, newPagination.per_page);
        setFilteredUsers(paginatedData);
        setIsFilterActive(query !== '' || position !== 'all');
    };

    const resetFilters = () => {
        setSearchQuery('');
        setPositionFilter('all');
        const newPagination = {
            total: reportUsers.length,
            per_page: pagination.per_page,
            current_page: 1,
            last_page: Math.ceil(reportUsers.length / pagination.per_page),
        };
        setPagination(newPagination);
        setFilteredUsers(reportUsers.slice(0, newPagination.per_page));
        setIsFilterActive(false);
    };

    // Initialize filtered users when component mounts or data changes
    useEffect(() => {
        const initialData = reportUsers.slice(0, pagination.per_page);
        setFilteredUsers(initialData);
        setPagination(prev => ({
            ...prev,
            total: reportUsers.length,
            last_page: Math.ceil(reportUsers.length / prev.per_page)
        }));
    }, [reportUsers]);

    const handleViewUser = (userId: string) => {
        const user = reportUsers.find((u) => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsViewDialogOpen(true);
        }
    };

    // Handle approve user
    const handleApproveUser = (userId: string) => {
        setIsLoading(true);
        setTimeout(() => {
            console.log('Approving user with ID:', userId);
            setIsLoading(false);
        }, 500);
    };

    const handleDeleteUser = (userId: string) => {
        setUserIdToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteUser = () => {
        setIsLoading(true);
        setTimeout(() => {
            console.log('Deleting user with ID:', userIdToDelete);
            const updatedUsers = reportUsers.filter((user) => user.id !== userIdToDelete);
            setFilteredUsers(updatedUsers.slice(0, pagination.per_page));
            setIsDeleteDialogOpen(false);
            setUserIdToDelete(null);
            setIsLoading(false);
        }, 500);
    };

    const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateUser = () => {
        setIsLoading(true);
        setTimeout(() => {
            console.log('Updating user:', editUser);
            const updatedUsers = reportUsers.map((user) => (user.id === editUser.id ? ({ ...user, ...editUser } as ReportUser) : user));
            setFilteredUsers(updatedUsers.slice(0, pagination.per_page));
            setIsEditDialogOpen(false);
            setIsLoading(false);
        }, 500);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports & Analytics" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    {/* Header with company name and period dates */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold mb-2">
                            {companyName !== "Loading..." ? companyName : "Reports & Analytics"}
                        </h2>
                        {periodInfo?.period?.start_date && periodInfo?.period?.end_date && (
                            <p className="text-sm text-gray-600">
                                {new Date(periodInfo.period.start_date).toLocaleDateString()} - {new Date(periodInfo.period.end_date).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                    
                    {/* Centered wizard navigation for all screen sizes with highlight */}
                    <div className="mb-6">
                        <CompanyWizard currentStep="reports" className="!mb-0 !shadow-none !bg-transparent !border-0" />
                    </div>

                    {/* Real Statistics Cards */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-xl font-semibold">
                            Statistika
                        </h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <Card className="rounded-md border p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                                    <p className="text-3xl font-bold">{statistics.total}</p>
                                </div>
                            </Card>

                            <Card className="rounded-md border p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-3xl font-bold">{statistics.completed}</p>
                                </div>
                            </Card>

                            <Card className="rounded-md border p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                                    <p className="text-3xl font-bold">{statistics.scheduled}</p>
                                </div>
                            </Card>

                            <Card className="rounded-md border p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Pending</p>
                                    <p className="text-3xl font-bold">{statistics.waiting}</p>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <CardDescription>
                                    {periodName && periodName !== "Loading..." && periodName !== "No period selected" ? (
                                        `View reports and analytics for ${periodName} recruitment period`
                                    ) : (
                                        'View reports and analytics for all recruitment data'
                                    )}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-4">
                                <SearchBar
                                    icon={<Search className="h-4 w-4" />}
                                    placeholder="Cari kandidat..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={isFilterActive ? 'default' : 'outline'} size="icon" className="relative">
                                            <Filter className="h-4 w-4" />
                                            {isFilterActive && <span className="bg-primary absolute -top-1 -right-1 h-2 w-2 rounded-full"></span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="font-inter w-80">
                                        <div className="space-y-4">
                                            <h4 className="font-medium text-gray-900">Filters</h4>
                                            <div className="space-y-2">
                                                <Label htmlFor="position-filter" className="text-sm text-gray-700">
                                                    Position
                                                </Label>
                                                <Select value={positionFilter} onValueChange={handlePositionFilter}>
                                                    <SelectTrigger id="position-filter">
                                                        <SelectValue placeholder="Filter by position" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Positions</SelectItem>
                                                        {uniquePositions.map((position) => (
                                                            <SelectItem
                                                                key={position}
                                                                value={position.toLowerCase()}
                                                            >
                                                                {position}
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
                            <ReportsTable
                                candidates={filteredUsers}
                                pagination={pagination}
                                onView={handleViewUser}
                                onApprove={handleApproveUser}
                                onDelete={handleDeleteUser}
                                onPageChange={handlePageChange}
                                isLoading={isLoading}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* View User Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="font-medium">ID:</div>
                                <div className="col-span-2">{selectedUser.id}</div>

                                <div className="font-medium">Name:</div>
                                <div className="col-span-2">{selectedUser.name}</div>

                                <div className="font-medium">Email:</div>
                                <div className="col-span-2">{selectedUser.email}</div>

                                <div className="font-medium">Position:</div>
                                <div className="col-span-2">{selectedUser.position}</div>

                                <div className="font-medium">Registration Date:</div>
                                <div className="col-span-2">{selectedUser.registration_date}</div>

                                {selectedUser.overall_score && (
                                    <>
                                        <div className="font-medium">Overall Score:</div>
                                        <div className="col-span-2">{selectedUser.overall_score}</div>
                                    </>
                                )}

                                {selectedUser.final_decision && (
                                    <>
                                        <div className="font-medium">Final Decision:</div>
                                        <div className="col-span-2 capitalize">{selectedUser.final_decision}</div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter className="sm:justify-end">
                        <Button onClick={() => setIsViewDialogOpen(false)} className="bg-blue-500 text-white hover:bg-blue-600">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteUser} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
