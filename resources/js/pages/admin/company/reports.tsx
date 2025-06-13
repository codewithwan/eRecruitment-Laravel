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
import { useState } from 'react';

// Removed unused PaginationData interface

type AdminUser = {
    id: string;
    name: string;
    email: string;
    position: string;
    registration_date: string;
    interview_stage?: string;
    final_score?: number;
    selection_status?: string;
    candidate_summary: {
        psychological_score: number;
        interview_score: number;
        feedback_1: string;
        feedback_2: string;
    }[];
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

export default function ReportsDashboard() {
    // Mock data for the administration table
    const [adminUsers] = useState<AdminUser[]>([
        {
            id: '01',
            name: 'Rizal Farhan Nanda',
            email: 'Rizalfarhannanda@gmail.com',
            position: 'UI / UX',
            registration_date: 'Mar 20, 2025',
            interview_stage: '1',
            final_score: 85,
            selection_status: '1',
            candidate_summary: [
                {
                    psychological_score: 85,
                    interview_score: 90,
                    feedback_1: 'Strong technical skills',
                    feedback_2: 'Good communication'
                }
            ]
        },
        {
            id: '02',
            name: 'Rizal Farhan Nanda',
            email: 'Rizalfarhannanda@gmail.com',
            position: 'UI / UX',
            registration_date: 'Mar 20, 2025',
            interview_stage: '2',
            final_score: 85,
            selection_status: '1',
            candidate_summary: [
                {
                    psychological_score: 85,
                    interview_score: 90,
                    feedback_1: 'Strong technical skills',
                    feedback_2: 'Good communication'
                }
            ]
        },
        {
            id: '03',
            name: 'Rizal Farhan Nanda',
            email: 'Rizalfarhannanda@gmail.com',
            position: 'UI / UX',
            registration_date: 'Mar 20, 2025',
            interview_stage: '3',
            final_score: 85,
            selection_status: '1',
            candidate_summary: [
                {
                    psychological_score: 85,
                    interview_score: 90,
                    feedback_1: 'Strong technical skills',
                    feedback_2: 'Good communication'
                }
            ]
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
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-2xl font-semibold">Reports & Analytics</h2>
                        </div>
                    </div>

                    {/* Interview Statistics Cards */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-xl font-semibold">Mitra Karya Analitika</h3>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <Card className="rounded-md border p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                                    <p className="text-3xl font-bold">15</p>
                                </div>
                            </Card>

                            <Card className="rounded-md border p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-3xl font-bold">7</p>
                                </div>
                            </Card>

                            <Card className="rounded-md border p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Scheduled</p>
                                    <p className="text-3xl font-bold">5</p>
                                </div>
                            </Card>

                            <Card className="rounded-md border p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Waiting</p>
                                    <p className="text-3xl font-bold">1</p>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium">Interview Candidates</h3>
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
            {/* View User Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{selectedUser?.name}</DialogTitle>
                        <p className="text-sm text-gray-500">{selectedUser?.position}</p>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="border p-3 rounded shadow-sm h-24 flex flex-col justify-between">
                                    <div className="text-gray-500 text-sm">Tahap saat ini</div>
                                    <div className="text-2xl font-bold">{selectedUser.interview_stage}</div>
                                    <div className="text-sm">Interview</div>
                                </div>
                                <div className="border p-3 rounded shadow-sm h-24 flex flex-col justify-between">
                                    <div className="text-gray-500 text-sm">Nilai Terakhir</div>
                                    <div className="text-2xl font-bold">{selectedUser.final_score}</div>
                                    <div className="text-sm">&nbsp;</div>
                                </div>
                                <div className="border p-3 rounded shadow-sm h-24 flex flex-col justify-between">
                                    <div className="text-gray-500 text-sm">Status Seleksi</div>
                                    <div className="text-2xl font-bold">{selectedUser.selection_status}</div>
                                    <div className="text-sm">&nbsp;</div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-semibold mb-2">Rangkuman Kandidat</h4>
                                {selectedUser.candidate_summary.map((summary, index) => (
                                    <ul key={index} className="list-disc list-inside text-sm space-y-1">
                                        <li>Psikotest skor {summary.psychological_score}</li>
                                        <li>Interview skor {summary.interview_score}</li>
                                        <li>{summary.feedback_1}</li>
                                        <li>{summary.feedback_2}</li>
                                    </ul>
                                ))}
                            </div>
                        </div>
                    )}
                    <DialogFooter className="sm:justify-end mt-4">
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
        </AppLayout >
    );
}
