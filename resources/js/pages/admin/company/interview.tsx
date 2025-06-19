import { InterviewTable, type InterviewUser } from '@/components/company-table-interview';
import { CompanyWizard } from '@/components/company-wizard';
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
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePeriodCompanyInfo } from '@/hooks/usePeriodCompanyInfo';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Filter, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface InterviewManagementProps {
    users?: InterviewUser[];
    pagination?: PaginationData;
    selectedPeriod?: {
        id: string;
        name: string;
        company?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Interview',
        href: '/dashboard/company/interview',
    },
];

export default function InterviewDashboard(props: InterviewManagementProps) {
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

    // Mock data for the administration table with proper date format
    const mockUsers: InterviewUser[] = [
        {
            id: '1',
            name: 'Rizal Farhan Nanda',
            email: 'Rizalfarhannanda@gmail.com',
            position: 'UI / UX',
            registration_date: '2025-03-20',
            status: 'scheduled'
        },
        {
            id: '2',
            name: 'M. Hassan Naufal Zayyan',
            email: 'hassannaufal@gmail.com',
            position: 'Back End',
            registration_date: '2025-03-18',
            status: 'completed'
        },
        {
            id: '3',
            name: 'Ardan Ferdiansah',
            email: 'ardanferdiansah@gmail.com',
            position: 'Front End',
            registration_date: '2025-03-18',
            status: 'pending'
        },
        {
            id: '4',
            name: 'Muhammad Ridwan',
            email: 'muhammadridwan@gmail.com',
            position: 'UX Writer',
            registration_date: '2025-03-20',
            status: 'rejected'
        },
        {
            id: '5',
            name: 'Untara Eka Saputra',
            email: 'untaraeka@gmail.com',
            position: 'IT Spesialis',
            registration_date: '2025-03-22',
            status: 'scheduled'
        },
        {
            id: '6',
            name: 'Dea Derika Winahyu',
            email: 'deaderika@gmail.com',
            position: 'UX Writer',
            registration_date: '2025-03-20',
            status: 'pending'
        },
        {
            id: '7',
            name: 'Kartika Yuliana',
            email: 'kartikayuliana@gmail.com',
            position: 'IT Spesialis',
            registration_date: '2025-03-22',
            status: 'completed'
        },
        {
            id: '8',
            name: 'Ayesha Dear Raisha',
            email: 'ayeshadear@gmail.com',
            position: 'UX Writer',
            registration_date: '2025-03-20',
            status: 'scheduled'
        },
    ];

    const initialUsers = props.users || mockUsers;
    const initialPagination = props.pagination || {
        total: initialUsers.length,
        per_page: 10,
        current_page: 1,
        last_page: Math.ceil(initialUsers.length / 10),
    };

    const [users, setUsers] = useState(initialUsers);
    const [filteredUsers, setFilteredUsers] = useState(initialUsers);
    const [pagination, setPagination] = useState(initialPagination);
    const [isLoading, setIsLoading] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<InterviewUser | null>(null);
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
    const [editUser, setEditUser] = useState<Partial<InterviewUser>>({});

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [positionFilter, setPositionFilter] = useState('all');
    const [isFilterActive, setIsFilterActive] = useState(false);

    // Get unique positions dynamically from the user data
    const uniquePositions = useMemo(() => {
        const positions = new Set(users.map(user => user.position));
        return Array.from(positions).sort();
    }, [users]);

    // Apply filters whenever filter states change
    useEffect(() => {
        let result = users;

        // Apply search filter
        if (searchQuery) {
            result = result.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.position.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Apply position filter
        if (positionFilter && positionFilter !== 'all') {
            result = result.filter((user) => user.position.toLowerCase() === positionFilter.toLowerCase());
        }

        setFilteredUsers(result);

        // Set filter active state
        setIsFilterActive(searchQuery !== '' || positionFilter !== 'all');
    }, [searchQuery, positionFilter, users]);

    // Mock function to simulate fetching users (replace with actual API call)
    const fetchUsers = useCallback(
        async (page = 1, perPage = pagination.per_page) => {
            setIsLoading(true);
            try {
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 500));

                // Mock pagination logic
                const startIndex = (page - 1) * perPage;
                const endIndex = startIndex + perPage;
                const paginatedUsers = users.slice(startIndex, endIndex);

                setFilteredUsers(paginatedUsers);
                setPagination({
                    total: users.length,
                    per_page: perPage,
                    current_page: page,
                    last_page: Math.ceil(users.length / perPage),
                });
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        },
        [users, pagination.per_page],
    );

    const handlePageChange = (page: number) => {
        fetchUsers(page, pagination.per_page);
    };

    const handlePerPageChange = (perPage: number) => {
        fetchUsers(1, perPage);
    };

    const handleViewUser = (userId: string) => {
        // Navigate to interview detail page instead of opening dialog
        router.visit(`/dashboard/company/interview/${userId}`);
    };

    const handleApproveUser = (userId: string) => {
        setIsLoading(true);
        setTimeout(() => {
            console.log('Approving user with ID:', userId);
            // Add your approval logic here
            setIsLoading(false);
        }, 500);
    };

    const handleDeleteUser = (userId: string) => {
        setUserIdToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteUser = () => {
        if (userIdToDelete === null) return;

        setIsLoading(true);
        setTimeout(() => {
            console.log('Deleting user with ID:', userIdToDelete);
            const updatedUsers = users.filter((user) => user.id !== userIdToDelete);
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
            setIsDeleteDialogOpen(false);
            setUserIdToDelete(null);
            setIsLoading(false);
        }, 500);
    };

    const handleEditUser = (userId: string) => {
        const user = users.find((u) => u.id === userId);
        if (user) {
            setEditUser({ ...user });
            setIsEditDialogOpen(true);
        }
    };

    const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateUser = () => {
        if (!editUser.id) return;

        setIsLoading(true);
        setTimeout(() => {
            console.log('Updating user:', editUser);
            const updatedUsers = users.map((user) =>
                user.id === editUser.id ? ({ ...user, ...editUser } as InterviewUser) : user,
            );
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
            setIsEditDialogOpen(false);
            setIsLoading(false);
        }, 500);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setPositionFilter('all');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Interview" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    {/* Header with company name and period dates */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold mb-2">
                            {companyName !== "Loading..." ? companyName : "Interview"}
                        </h2>
                        {periodInfo?.period?.start_date && periodInfo?.period?.end_date && (
                            <p className="text-sm text-gray-600">
                                {new Date(periodInfo.period.start_date).toLocaleDateString()} - {new Date(periodInfo.period.end_date).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                    
                    {/* Centered wizard navigation for all screen sizes with highlight */}
                    <div className="mb-6">
                        <CompanyWizard currentStep="interview" className="!mb-0 !shadow-none !bg-transparent !border-0" />
                    </div>
                    
                    <Card>
                        <CardHeader className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <CardDescription>
                                    {periodName && periodName !== "Loading..." && periodName !== "No period selected" ? (
                                        `Manage interviews for ${periodName} recruitment period`
                                    ) : (
                                        'Manage all interviews in the system'
                                    )}
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-4">
                                <SearchBar
                                    icon={<Search className="h-4 w-4" />}
                                    placeholder="Cari kandidat..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
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
                                            <h4 className="font-inter font-medium text-gray-900">Filters</h4>
                                            <div className="space-y-2">
                                                <Label htmlFor="position-filter" className="font-inter text-sm text-gray-700">
                                                    Position
                                                </Label>
                                                <Select value={positionFilter} onValueChange={setPositionFilter}>
                                                    <SelectTrigger id="position-filter" className="font-inter">
                                                        <SelectValue placeholder="Filter by position" className="font-inter" />
                                                    </SelectTrigger>
                                                    <SelectContent className="font-inter">
                                                        <SelectItem
                                                            value="all"
                                                            className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                        >
                                                            All Positions
                                                        </SelectItem>
                                                        {uniquePositions.map((position) => (
                                                            <SelectItem
                                                                key={position}
                                                                value={position.toLowerCase()}
                                                                className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                            >
                                                                {position}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button variant="outline" size="sm" onClick={resetFilters} className="font-inter text-xs">
                                                    Reset Filters
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <InterviewTable
                                users={filteredUsers}
                                pagination={pagination}
                                onView={handleViewUser}
                                onEdit={handleEditUser}
                                onDelete={handleDeleteUser}
                                onApprove={handleApproveUser}
                                onPageChange={handlePageChange}
                                onPerPageChange={handlePerPageChange}
                                isLoading={isLoading}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-sm overflow-hidden rounded-lg border-2 bg-white p-0 shadow-lg">
                    <div className="flex items-center justify-between border-b p-4">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">Edit Candidate</h2>
                            <p className="text-sm text-gray-500">Update the details of the candidate</p>
                        </div>
                    </div>

                    <div className="px-4 pt-3 pb-5">
                        <div className="space-y-4">
                            <div className="relative">
                                <label htmlFor="edit-name" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Name
                                </label>
                                <input
                                    id="edit-name"
                                    name="name"
                                    value={editUser.name || ''}
                                    onChange={handleEditUserChange}
                                    placeholder="Enter candidate name"
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="relative">
                                <label htmlFor="edit-email" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Email
                                </label>
                                <input
                                    id="edit-email"
                                    name="email"
                                    value={editUser.email || ''}
                                    onChange={handleEditUserChange}
                                    placeholder="Enter candidate email"
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="relative">
                                <label htmlFor="edit-position" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Position
                                </label>
                                <input
                                    id="edit-position"
                                    name="position"
                                    value={editUser.position || ''}
                                    onChange={handleEditUserChange}
                                    placeholder="Enter position"
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={() => setIsEditDialogOpen(false)}
                                className="rounded-md border border-blue-500 bg-white px-4 py-1.5 text-sm font-medium text-blue-500 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateUser}
                                disabled={isLoading}
                                className="rounded-md bg-blue-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
                            >
                                {isLoading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete User Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this candidate? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteUser} className="bg-blue-500 text-white hover:bg-blue-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
