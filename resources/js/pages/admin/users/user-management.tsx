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
import { UserTable, type User } from '@/components/user-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Filter } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const [isFilterActive, setIsFilterActive] = useState(false);

    // Get unique roles for filters
    const uniqueRoles = ['all', ...Array.from(new Set(users.map((user) => user.role)))];

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') ? parseInt(urlParams.get('page')!) : 1;
        const perPage = urlParams.get('per_page') ? parseInt(urlParams.get('per_page')!) : 10;

        if (page !== pagination.current_page || perPage !== pagination.per_page) {
            fetchUsers(page, perPage);
        }
    }, []);

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

        setFilteredUsers(result);

        // Set filter active state
        setIsFilterActive(searchQuery !== '' || roleFilter !== 'all');
    }, [searchQuery, roleFilter, users]);

    const fetchUsers = async (page = 1, perPage = pagination.per_page) => {
        setIsLoading(true);
        try {
            // Update URL without full page refresh
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
    };

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
            // After successful deletion, refresh the current page
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
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">User Management</h2>
                        <Button className="mx-10 px-10" onClick={handleAddUser}>
                            Add User
                        </Button>
                    </div>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Users List</CardTitle>
                                <CardDescription>Manage all users in the system</CardDescription>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative"></div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={isFilterActive ? 'default' : 'outline'} size="icon" className="relative">
                                            <Filter className="h-4 w-4" />
                                            {isFilterActive && <span className="bg-primary absolute -top-1 -right-1 h-2 w-2 rounded-full"></span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className="space-y-4">
                                            <h4 className="font-medium">Filters</h4>
                                            <div className="space-y-2">
                                                <Label htmlFor="role-filter">Role</Label>
                                                <Select value={roleFilter} onValueChange={setRoleFilter}>
                                                    <SelectTrigger id="role-filter">
                                                        <SelectValue placeholder="Filter by role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {uniqueRoles.map((role) => (
                                                            <SelectItem key={role} value={role}>
                                                                {role === 'all' ? 'All Roles' : role}
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
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create User</DialogTitle>
                        <DialogDescription>Fill in the details to create a new user.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" value={newUser.name} onChange={handleCreateUserChange} />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" value={newUser.email} onChange={handleCreateUserChange} />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" value={newUser.password} onChange={handleCreateUserChange} />
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <Select value={newUser.role} onValueChange={(value) => setNewUser((prevState) => ({ ...prevState, role: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateUser} disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user information.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Name</Label>
                            <Input id="edit-name" name="name" value={editUser.name} onChange={handleEditUserChange} />
                        </div>
                        <div>
                            <Label htmlFor="edit-email">Email</Label>
                            <Input id="edit-email" name="email" value={editUser.email} onChange={handleEditUserChange} />
                        </div>
                        <div>
                            <Label htmlFor="edit-role">Role</Label>
                            <Select value={editUser.role} onValueChange={(value) => setEditUser((prevState) => ({ ...prevState, role: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdateUser} disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
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
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
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
                        <AlertDialogAction onClick={confirmDeleteUser}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
