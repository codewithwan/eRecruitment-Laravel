import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserTable, type User } from '@/components/user-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
    users?: User[];
    traffic?: Record<string, number>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard(props: DashboardProps) {
    const users = props.users || [];
    const traffic = props.traffic || {};
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Generate last 7 days array
    const getLast7Days = () => {
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            result.push({
                fullDate: date.toISOString().split('T')[0], // YYYY-MM-DD format for comparison
                formatted: date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })
            });
        }
        return result;
    };

    const trafficData = getLast7Days().map(day => {
        const matchingDate = Object.entries(traffic).find(
            ([date]) => date.split('T')[0] === day.fullDate
        );

        // Return data with users count (or 0 if no data)
        return {
            date: day.formatted,
            users: matchingDate ? matchingDate[1] : 0
        };
    });

    const handleViewUser = (userId: number) => {
        const user = users.find(user => user.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsViewDialogOpen(true);
        }
    };

    const handleEditUser = (userId: number) => {
        console.log('Edit user from dashboard:', userId);
        // Dashboard edit implementation
    };

    const handleDeleteUser = (userId: number) => {
        console.log('Delete user from dashboard:', userId);
        // Dashboard delete implementation
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Regular Users</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Users with "candidate" role
                            </p>
                        </CardContent>
                    </Card>

                    {/* Additional stat cards can go here */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New User Signups</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Object.values(traffic).reduce((sum, count) => sum + count, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total registrations over time
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Traffic Chart - In its own row */}
                <div className="pt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="col-span-2 grid gap-4">
                        <CardHeader>
                            <CardTitle>User Registration Traffic</CardTitle>
                            <CardDescription>
                                User registration activity over the last 7 days
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Recharts Area Chart */}
                            {trafficData.length > 0 ? (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={trafficData}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area
                                                type="monotone"
                                                dataKey="users"
                                                stroke="hsl(var(--primary))"
                                                fill="hsl(var(--primary) / 0.2)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-64 flex items-center justify-center border rounded-md">
                                    <p className="text-muted-foreground">No traffic data available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table Section */}
                <div className="pt-2">
                    <h2 className="text-2xl font-semibold mb-4">User Management</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Users List</CardTitle>
                            <CardDescription>
                                List of all registered users in the system.
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
        </AppLayout>
    );
}
