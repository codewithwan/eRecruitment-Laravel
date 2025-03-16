import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';
import { UserTable, type User } from '@/components/user-table';
import { Button } from '@/components/ui/button';

interface UserManagementProps {
    users?: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    // {
    //     title: 'Dashboard',
    //     href: '/dashboard',
    // },
    {
        title: 'User Management',
        href: '/dashboard/users',
    }
];

export default function UserManagement(props: UserManagementProps) {
    // Use useMemo to stabilize the users array reference
    const users = useMemo(() => props.users || [], [props.users]);
    const handleViewUser = (userId: number) => {
        console.log('View user:', userId);
    };

    const handleEditUser = (userId: number) => {
        console.log('Edit user:', userId);
    };

    const handleDeleteUser = (userId: number) => {
        console.log('Delete user:', userId);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">User Management</h2>
                        <Button className='px-10 mx-10'>Add User</Button>
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
                                users={users}
                                onView={handleViewUser}
                                onEdit={handleEditUser}
                                onDelete={handleDeleteUser}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
