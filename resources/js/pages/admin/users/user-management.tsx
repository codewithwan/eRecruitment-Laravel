import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { UserTable, type User } from '@/components/user-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';

interface UserManagementProps {
    users?: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'User Management',
        href: '/dashboard/users',
    }
];

const roles = [
    { value: 'candidate', label: 'Candidate' },
    { value: 'hr', label: 'HR' },
    { value: 'head_hr', label: 'Head HR' },
    { value: 'head_dev', label: 'Head Dev' },
    { value: 'super_admin', label: 'Super Admin' },
];

export default function UserManagement(props: UserManagementProps) {
    const users = props.users || [];
    const [userList, setUserList] = useState(users);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '',password : '', role: '' });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleViewUser = (userId: number) => {
        const user = users.find(user => user.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsViewDialogOpen(true);
        }
    };

    const handleEditUser = (userId: number) => {
        console.log('Edit user:', userId);
    };

    const handleDeleteUser = (userId: number) => {
        setUserIdToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteUser = async () => {
        if (userIdToDelete === null) return;

        try {
            await axios.delete(`/dashboard/users/${userIdToDelete}`);
            setUserList(prevUsers => prevUsers.filter(user => user.id !== userIdToDelete));
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
        setNewUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCreateUser = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/dashboard/users', newUser);
            setUserList(prevUsers => [...prevUsers, response.data.user]);
            setIsCreateDialogOpen(false);
            setNewUser({ name: '', email: '', password: '', role: '' });
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">User Management</h2>
                        <Button className='px-10 mx-10' onClick={handleAddUser}>Add User</Button>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Users List</CardTitle>
                            <CardDescription>
                                Manage all users in the system
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserTable
                                users={userList}
                                onView={handleViewUser}
                                onEdit={handleEditUser}
                                onDelete={handleDeleteUser}
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
                        <DialogDescription>
                            Fill in the details to create a new user.
                        </DialogDescription>
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
                            <Select value={newUser.role} onValueChange={(value) => setNewUser(prevState => ({ ...prevState, role: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateUser} disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* User Detail Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about the selected user.
                        </DialogDescription>
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
                        <Button
                            variant="outline"
                            onClick={() => setIsViewDialogOpen(false)}
                        >
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
                        <AlertDialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </AlertDialogDescription>
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
