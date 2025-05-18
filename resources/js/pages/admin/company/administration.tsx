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
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Check, Eye, Filter, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Update the AdminUser type to include periodId
type AdminUser = {
    id: string;
    name: string;
    email: string;
    position: string;
    registration_date: string;
    period: string;
    periodId: string; // Add this field for proper filtering
    vacancy: string;
};

type Period = {
    id: number;
    name: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Administration',
        href: '/dashboard/administration', // Updated path
    },
];

export default function AdministrationDashboard({ companyId = 1 }) {
    // Fix type issue by using string | null consistently
    const [selectedPeriodId, setSelectedPeriodId] = useLocalStorage<string | null>('selectedPeriodId', null);
    
    // Mock data for the administration table with periodId included
    const [adminUsers] = useState<AdminUser[]>([
        {
            id: '01',
            name: 'Rizal Farhan Nanda',
            email: 'Rizalfarhannanda@gmail.com',
            position: 'UI / UX',
            registration_date: 'Mar 20, 2025',
            period: 'Q1 2025 Recruitment',
            periodId: '1', // Add periodId to match selectedPeriodId
            vacancy: 'UI/UX Designer',
        },
        {
            id: '02',
            name: 'M. Hassan Naufal Zayyan',
            email: 'hassan@example.com',
            position: 'Back End',
            registration_date: 'Mar 18, 2025',
            period: 'Q1 2025 Recruitment',
            periodId: '1',
            vacancy: 'Back End Developer',
        },
        {
            id: '03',
            name: 'Ardan Ferdiansah',
            email: 'ardan@example.com',
            position: 'Front End',
            registration_date: 'Mar 18, 2025',
            period: 'Q1 2025 Recruitment',
            periodId: '1',
            vacancy: 'Front End Developer',
        },
        {
            id: '04',
            name: 'Muhammad Ridwan',
            email: 'ridwan@example.com',
            position: 'UX Writer',
            registration_date: 'Mar 20, 2025',
            period: 'Q1 2025 Recruitment',
            periodId: '1',
            vacancy: 'UX Writer',
        },
        {
            id: '05',
            name: 'Untara Eka Saputra',
            email: 'untara@example.com',
            position: 'IT Spesialis',
            registration_date: 'Mar 22, 2025',
            period: 'Q1 2025 Recruitment',
            periodId: '1',
            vacancy: 'IT Specialist',
        },
        {
            id: '06',
            name: 'Dea Derika Winahyu',
            email: 'dea@example.com',
            position: 'UX Writer',
            registration_date: 'Mar 20, 2025',
            period: 'Q1 2025 Recruitment',
            periodId: '1',
            vacancy: 'UX Writer',
        },
        {
            id: '07',
            name: 'Kartika Yuliana',
            email: 'kartika@example.com',
            position: 'IT Spesialis',
            registration_date: 'Mar 22, 2025',
            period: 'Q1 2025 Recruitment',
            periodId: '1',
            vacancy: 'IT Specialist',
        },
        {
            id: '08',
            name: 'Ayesha Dear Raisha',
            email: 'ayesha@example.com',
            position: 'UX Writer',
            registration_date: 'Mar 20, 2025',
            period: 'Q1 2025 Recruitment',
            periodId: '1',
            vacancy: 'UX Writer',
        },
    ]);

    // Add period filter state
    const [periods, setPeriods] = useState<Period[]>([
        { id: 1, name: 'Q1 2025 Recruitment' },
        { id: 2, name: 'Q2 2025 Recruitment' },
    ]);
    
    // Use the string value directly for consistency
    const [selectedPeriod, setSelectedPeriod] = useState<string | null>(selectedPeriodId);
    
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

    // Effect to filter users by company ID and period ID
    useEffect(() => {
        let result = adminUsers;
        
        // Filter by company ID (would be implemented with real data)
        // This is just a placeholder for the actual implementation
        // result = result.filter(user => user.companyId === companyId);
        
        // Filter by period using periodId instead of name
        if (selectedPeriod && selectedPeriod !== 'all') {
            result = result.filter(user => user.periodId === selectedPeriod);
        }

        // Apply other filters
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

        setFilteredUsers(result);
        setIsFilterActive(searchQuery !== '' || positionFilter !== 'all' || selectedPeriod !== null);
    }, [companyId, selectedPeriod, searchQuery, positionFilter]);
    
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
        setSelectedPeriod(null);
        setSelectedPeriodId(null); // Also clear the localStorage value
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
            <Head title="Administration" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Administration</h2>
                        <div className="flex space-x-2">
                            <SearchBar
                                icon={<Search className="h-4 w-4" />}
                                placeholder="Search..."
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
                                <PopoverContent className="w-72">
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900">Filters</h4>
                                        
                                        {/* Add period filter */}
                                        <div className="space-y-2">
                                            <Label htmlFor="period-filter" className="text-sm text-gray-700">
                                                Period
                                            </Label>
                                            <Select 
                                                value={selectedPeriod || 'all'} 
                                                onValueChange={(value) => setSelectedPeriod(value === 'all' ? null : value)}
                                            >
                                                <SelectTrigger id="period-filter">
                                                    <SelectValue placeholder="All Periods" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Periods</SelectItem>
                                                    {periods.map(period => (
                                                        <SelectItem key={period.id} value={period.id.toString()}>
                                                            {period.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
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
                                                    <SelectItem value="ui / ux">UI / UX</SelectItem>
                                                    <SelectItem value="back end">Back End</SelectItem>
                                                    <SelectItem value="front end">Front End</SelectItem>
                                                    <SelectItem value="ux writer">UX Writer</SelectItem>
                                                    <SelectItem value="it spesialis">IT Spesialis</SelectItem>
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
                    </div>
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-left">
                                    <tr>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">ID</th>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">Name</th>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">Email</th>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">Position</th>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">Period</th>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">Registration Date</th>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{user.id}</td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{user.name}</td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{user.email}</td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{user.position}</td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{user.period}</td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{user.registration_date}</td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        onClick={() => handleViewUser(user.id)}
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-blue-500"
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleApproveUser(user.id)}
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-green-500"
                                                        title="Approve"
                                                    >
                                                        <Check size={16} />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-blue-500"
                                                    >
                                                        <X size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
