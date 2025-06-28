import { CompanyWizard } from '@/components/company-wizard';
import { ReportsTable } from '@/components/reports-table'; // Tambahkan import ini
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

// Removed unused PaginationData interface

type AdminUser = {
    id: string;
    name: string;
    email: string;
    position: string;
    administration: number;
    assessment: number;
    interview: number;
};

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
    selectedPeriod?: {
        id: string;
        name: string;
        company?: string;
    };
}

export default function ReportsDashboard(props?: ReportsProps) {
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

    // Mock data for the administration table
    const [adminUsers] = useState<AdminUser[]>([
        {
            id: '01',
            name: 'Rizal Farhan Nanda',
            email: 'Rizalfarhannanda@gmail.com',
            position: 'UI / UX',
            administration: 80,
            assessment: 85,
            interview: 90,

        },
        {
            id: '02',
            name: 'M. Hassan Naufal Zayyan',
            email: 'Rizalfarhannanda@gmail.com',
            position: 'Back End',
            administration: 80,
            assessment: 70,
            interview: 75,
        },
        {
            id: '03',
            name: 'Ardan Ferdiansah',
            email: 'Rizalfarhannanda@gmail.com',
            position: 'Front End',
            administration: 80,
            assessment: 70,
            interview: 85,
        },
        {
            id: '04',
            name: 'Muhammad Ridwan',
            email: 'Rizalfarhannanda@gmail.com',
            position: 'UX Writer',
            administration: 90,
            assessment: 85,
            interview: 95,
        },
        {
            id: '05',
            name: 'Untara Eka Saputra',
            email: 'Rizalfarhannanda@gmail.com',
            position: 'IT Spesialis',
            administration: 70,
            assessment: 75,
            interview: 80,
        },
        {
            id: '06',
            name: 'Dea Derika Winahyu',
            email: 'Rizalfarhannanda@gmail.com',
            position: 'UX Writer',
            administration: 80,
            assessment: 75,
            interview: 75,
        },
        {
            id: '07',
            name: 'Kartika Yuliana',
            email: 'Rizalfarhannanda@gmail.com',
            position: 'IT Spesialis',
            administration: 85,
            assessment: 90,
            interview: 85,
        },
        {
            id: '08',
            name: 'Ayesha Dear Raisha',
            email: 'Rizalfarhannanda@gmail.com',
            position: 'UX Writer',
            administration: 90,
            assessment: 85,
            interview: 80,
        },
    ]);

    // Filter and search state
    const [filteredUsers, setFilteredUsers] = useState(adminUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [positionFilter, setPositionFilter] = useState('all');
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
    const [editUser, setEditUser] = useState<Partial<AdminUser>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Tambahkan mock pagination
    const [pagination, setPagination] = useState({
        total: filteredUsers.length,
        per_page: 8,
        current_page: 1,
        last_page: 1,
    });

    // Handler untuk pagination (jika ingin paging manual, update filteredUsers sesuai page)
    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, current_page: page }));
        // Jika data dari backend, fetch data page baru di sini
    };

    // Get unique positions dynamically from the user data
    const uniquePositions = useMemo(() => {
        const positions = new Set(adminUsers.map(user => user.position));
        return Array.from(positions).sort();
    }, [adminUsers]);

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
        let result = adminUsers;

        if (query) {
            result = result.filter(
                (user) =>
                    user.name.toLowerCase().includes(query.toLowerCase()) ||
                    user.email.toLowerCase().includes(query.toLowerCase()) ||
                    user.position.toLowerCase().includes(query.toLowerCase()),
            );
        }

        if (position !== 'all') {
            result = result.filter((user) => user.position.toLowerCase() === position.toLowerCase());
        }

        setFilteredUsers(result);
        setIsFilterActive(query !== '' || position !== 'all');
    };

    const resetFilters = () => {
        setSearchQuery('');
        setPositionFilter('all');
        setFilteredUsers(adminUsers);
        setIsFilterActive(false);
    };

    const handleViewUser = (userId: string) => {
        const user = adminUsers.find((u) => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsViewDialogOpen(true);
        }
    };

    // Menambahkan fungsi baru untuk meng-handle check/approve user
    const handleApproveUser = (userId: string) => {
        // Mock approval functionality
        setIsLoading(true);
        setTimeout(() => {
            console.log('Approving user with ID:', userId);
            // Di sini Anda dapat menambahkan logika untuk mengubah status user menjadi "approved" jika diperlukan
            setIsLoading(false);
            // Optional: Tampilkan notifikasi sukses atau perbarui UI
        }, 500);
    };

    const handleDeleteUser = (userId: string) => {
        setUserIdToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteUser = () => {
        // Mock deletion functionality
        setIsLoading(true);
        setTimeout(() => {
            console.log('Deleting user with ID:', userIdToDelete);
            setFilteredUsers(filteredUsers.filter((user) => user.id !== userIdToDelete));
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
        // Mock update functionality
        setIsLoading(true);
        setTimeout(() => {
            console.log('Updating user:', editUser);
            setFilteredUsers(filteredUsers.map((user) => (user.id === editUser.id ? ({ ...user, ...editUser } as AdminUser) : user)));
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

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <input
                                    id="edit-name"
                                    name="name"
                                    value={editUser.name || ''}
                                    onChange={handleEditUserChange}
                                    className="w-full rounded-md border px-3 py-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <input
                                    id="edit-email"
                                    name="email"
                                    value={editUser.email || ''}
                                    onChange={handleEditUserChange}
                                    className="w-full rounded-md border px-3 py-2"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-position">Position</Label>
                                <input
                                    id="edit-position"
                                    name="position"
                                    value={editUser.position || ''}
                                    onChange={handleEditUserChange}
                                    className="w-full rounded-md border px-3 py-2"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateUser} className="bg-blue-500 text-white hover:bg-blue-600" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this user? This action cannot be undone.</AlertDialogDescription>
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
