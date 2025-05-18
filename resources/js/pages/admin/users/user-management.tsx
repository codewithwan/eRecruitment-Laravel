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
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserTable } from '@/components/user-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { User } from '@/types/user';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Filter, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface UserManagementProps {
    users?: User[];
    pagination?: PaginationData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'User Management',
        href: '/dashboard/users',
    },
];

const roles = [
    { value: 'candidate', label: 'Candidate' },
    { value: 'hr', label: 'HR' },
    { value: 'head_hr', label: 'Head HR' },
    { value: 'head_dev', label: 'Head Dev' },
    { value: 'super_admin', label: 'Super Admin' },
];

export default function UserManagement(props: UserManagementProps) {
    const initialUsers = props.users || [];
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
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editUser, setEditUser] = useState<Partial<User>>({ name: '', email: '', role: '' });

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [verificationFilter, setVerificationFilter] = useState('all');
    const [isFilterActive, setIsFilterActive] = useState(false);

    const fetchUsers = useCallback(
        async (page = 1, perPage = pagination.per_page) => {
            setIsLoading(true);
            try {
                updateUrlParams(page, perPage);

                const response = await axios.get('/dashboard/users/list', {
                    params: {
                        page,
                        per_page: perPage,
                    },
                });
                setUsers(response.data.users);
                setFilteredUsers(response.data.users);
                setPagination(response.data.pagination);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setIsLoading(false);
            }
        },
        [pagination.per_page],
    );

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') ? parseInt(urlParams.get('page')!) : 1;
        const perPage = urlParams.get('per_page') ? parseInt(urlParams.get('per_page')!) : 10;

        if (page !== pagination.current_page || perPage !== pagination.per_page) {
            fetchUsers(page, perPage);
        }
    }, [fetchUsers, pagination.current_page, pagination.per_page]);

    // Apply filters whenever filter states change
    useEffect(() => {
        let result = users;

        // Apply search filter
        if (searchQuery) {
            result = result.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.role.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Apply role filter
        if (roleFilter && roleFilter !== 'all') {
            result = result.filter((user) => user.role === roleFilter);
        }

        // Apply verification filter
        if (verificationFilter !== 'all') {
            result = result.filter((user) => {
                if (verificationFilter === 'verified') {
                    return user.email_verified_at !== null;
                } else {
                    return user.email_verified_at === null;
                }
            });
        }

        setFilteredUsers(result);

        // Set filter active state
        setIsFilterActive(searchQuery !== '' || roleFilter !== 'all' || verificationFilter !== 'all');
    }, [searchQuery, roleFilter, verificationFilter, users]);

    // Function to update URL parameters without page refresh
    const updateUrlParams = (page: number, perPage: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page.toString());
        url.searchParams.set('per_page', perPage.toString());
        window.history.pushState({}, '', url.toString());
    };

    const handlePageChange = (page: number) => {
        fetchUsers(page, pagination.per_page);
    };

    const handlePerPageChange = (perPage: number) => {
        fetchUsers(1, perPage);
    };

    const handleViewUser = (userId: number) => {
        const user = users.find((user) => user.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsViewDialogOpen(true);
        }
    };

    const handleEditUser = (userId: number) => {
        const user = users.find((user) => user.id === userId);
        if (user) {
            setEditUser({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
            setIsEditDialogOpen(true);
        }
    };

    const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditUser((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleUpdateUser = async () => {
        if (!editUser.id) return;

        setIsLoading(true);
        try {
            await axios.put(`/dashboard/users/${editUser.id}`, editUser);
            fetchUsers(pagination.current_page, pagination.per_page);
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = (userId: number) => {
        setUserIdToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (userIdToDelete === null) return;

        try {
            await axios.delete(`/dashboard/users/${userIdToDelete}`);
            fetchUsers(pagination.current_page, pagination.per_page);
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setIsDeleteDialogOpen(false);
            setUserIdToDelete(null);
        }
    };

    const handleAddUser = () => {
        setIsCreateDialogOpen(true);
    };

    const handleCreateUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleCreateUser = async () => {
        setIsLoading(true);
        try {
            await axios.post('/dashboard/users', newUser);
            // After creating a user, refresh the current page
            fetchUsers(pagination.current_page, pagination.per_page);
            setIsCreateDialogOpen(false);
            setNewUser({ name: '', email: '', password: '', role: '' });
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setRoleFilter('all');
        setVerificationFilter('all');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">User Management</h2>
                        <Button
                            className="flex items-center gap-2 rounded-md bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
                            onClick={handleAddUser}
                        >
                            <span className="text-xl font-medium">+</span>
                            <span>Add User</span>
                        </Button>
                    </div>
                    <Card>
                        <CardHeader className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <CardTitle>Users List</CardTitle>
                                <CardDescription>Manage all users in the system</CardDescription>
                            </div>

                            <div className="flex items-center gap-4">
                                <SearchBar
                                    icon={<Search className="h-4 w-4" />}
                                    placeholder="Cari user..."
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
                                                <Label htmlFor="role-filter" className="font-inter text-sm text-gray-700">
                                                    Role
                                                </Label>
                                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                                    <SelectTrigger id="role-filter" className="font-inter">
                                                        <SelectValue placeholder="Filter by role" className="font-inter" />
                                                    </SelectTrigger>
                                                    <SelectContent className="font-inter">
                                                        <SelectItem
                                                            value="all"
                                                            className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                        >
                                                            All Roles
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="candidate"
                                                            className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                        >
                                                            Candidate
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="hr"
                                                            className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                        >
                                                            HR
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="head_dev"
                                                            className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                        >
                                                            Head Dev
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="super_admin"
                                                            className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                        >
                                                            Super Admin
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="verification-filter" className="font-inter text-sm text-gray-700">
                                                    Verification Status
                                                </Label>
                                                <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                                                    <SelectTrigger id="verification-filter" className="font-inter">
                                                        <SelectValue placeholder="Filter by verification" className="font-inter" />
                                                    </SelectTrigger>
                                                    <SelectContent className="font-inter">
                                                        <SelectItem
                                                            value="all"
                                                            className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                        >
                                                            All Users
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="verified"
                                                            className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                        >
                                                            Verified
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="unverified"
                                                            className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                        >
                                                            Unverified
                                                        </SelectItem>
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
                            <UserTable
                                users={filteredUsers}
                                pagination={pagination}
                                onView={handleViewUser}
                                onEdit={handleEditUser}
                                onDelete={handleDeleteUser}
                                onPageChange={handlePageChange}
                                onPerPageChange={handlePerPageChange}
                                isLoading={isLoading}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create User Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-sm overflow-hidden rounded-lg border-2 bg-white p-0 shadow-lg">
                    {/* Header with Close Button */}
                    <div className="flex items-center justify-between border-b p-4">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">Create User</h2>
                            <p className="text-sm text-gray-500">Fill in the details to create a new user</p>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="px-4 pt-3 pb-5">
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div className="relative">
                                <label htmlFor="name" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={newUser.name}
                                    onChange={handleCreateUserChange}
                                    placeholder="Enter username"
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="relative">
                                <label htmlFor="email" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={handleCreateUserChange}
                                    placeholder="Enter user email"
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="relative">
                                <label htmlFor="password" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={newUser.password}
                                    onChange={handleCreateUserChange}
                                    placeholder="Enter user password"
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Role Field */}
                            <div className="relative">
                                <label htmlFor="role" className="absolute top-2 left-3 z-10 text-sm text-blue-500">
                                    Role
                                </label>
                                <div className="relative">
                                    <Select
                                        value={newUser.role}
                                        onValueChange={(value) => setNewUser((prevState) => ({ ...prevState, role: value }))}
                                    >
                                        <SelectTrigger
                                            id="role"
                                            className="h-[60px] w-full rounded-md border border-blue-500 bg-white px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                textAlign: 'left',
                                            }}
                                        >
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full border border-gray-300 bg-white shadow-md">
                                            {roles.map((role) => (
                                                <SelectItem
                                                    key={role.value}
                                                    value={role.value}
                                                    className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700"
                                                >
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Footer/Buttons */}
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={() => setIsCreateDialogOpen(false)}
                                className="rounded-md border border-blue-500 bg-white px-4 py-1.5 text-sm font-medium text-blue-500 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateUser}
                                disabled={isLoading}
                                className="rounded-md bg-blue-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
                            >
                                {isLoading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-sm overflow-hidden rounded-lg border-2 bg-white p-0 shadow-lg">
                    {/* Header with Close Button */}
                    <div className="flex items-center justify-between border-b p-4">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">Edit User</h2>
                            <p className="text-sm text-gray-500">Update the details of the user</p>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="px-4 pt-3 pb-5">
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div className="relative">
                                <label htmlFor="edit-name" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Name
                                </label>
                                <input
                                    id="edit-name"
                                    name="name"
                                    type="text"
                                    value={editUser.name}
                                    onChange={handleEditUserChange}
                                    placeholder="Enter username"
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="relative">
                                <label htmlFor="edit-email" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Email
                                </label>
                                <input
                                    id="edit-email"
                                    name="email"
                                    type="email"
                                    value={editUser.email}
                                    onChange={handleEditUserChange}
                                    placeholder="Enter user email"
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Role Field */}
                            <div className="relative">
                                <label htmlFor="edit-role" className="absolute top-2 left-3 z-10 text-sm text-blue-500">
                                    Role
                                </label>
                                <div className="relative">
                                    <Select
                                        value={editUser.role}
                                        onValueChange={(value) => setEditUser((prevState) => ({ ...prevState, role: value }))}
                                    >
                                        <SelectTrigger
                                            id="edit-role"
                                            className="h-[60px] w-full rounded-md border border-blue-500 bg-white px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                textAlign: 'left',
                                            }}
                                        >
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full border border-gray-300 bg-white shadow-md">
                                            {roles.map((role) => (
                                                <SelectItem
                                                    key={role.value}
                                                    value={role.value}
                                                    className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700"
                                                >
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Footer/Buttons */}
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

            {/* User Detail Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>Detailed information about the selected user.</DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="font-medium">Name:</div>
                                <div className="col-span-2">{selectedUser.name}</div>

                                <div className="font-medium">Email:</div>
                                <div className="col-span-2">{selectedUser.email}</div>

                                <div className="font-medium">Role:</div>
                                <div className="col-span-2">{selectedUser.role}</div>

                                {selectedUser.created_at && (
                                    <>
                                        <div className="font-medium">Joined:</div>
                                        <div className="col-span-2">{new Date(selectedUser.created_at).toLocaleDateString()}</div>
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
