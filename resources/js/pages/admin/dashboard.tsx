import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type User } from '@/components/user-table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
    users?: User[];
    traffic?: Record<string, number>;
    job_applied?: Record<string, number>;
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
    const job_applied = props.job_applied || {};

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

    const jobAppliedTraffic = getLast7Days().map(day => {
        const matchingDate = Object.entries(job_applied).find(
            ([date]) => date.split('T')[0] === day.fullDate
        );

        // Return data with jobs count (or 0 if no data)
        return {
            date: day.formatted,
            users: matchingDate ? matchingDate[1] : 0
        };
    });

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
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jobs Applied</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Object.values(job_applied).reduce((sum, count) => sum + count, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total jobs applied over time
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Jobs Test</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                12
                            </div>
                            <p className="text-xs text-muted-foreground">
                                User test taken
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Interview</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                5
                            </div>
                            <p className="text-xs text-muted-foreground">
                                User interview scheduled
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Traffic Charts - Side by side */}
                <div className="pt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    {/* First Chart - User Registration */}
                    <Card className="grid gap-4">
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
                                                stroke="#82ca9d"
                                                fill="#82ca9d50"
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

                    {/* Second Chart - Jobs Applied */}
                    <Card className="grid gap-4">
                        <CardHeader>
                            <CardTitle>Jobs Application Trend</CardTitle>
                            <CardDescription>
                                Job application activity over the last 7 days
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {jobAppliedTraffic.length > 0 ? (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={jobAppliedTraffic}
                                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area
                                                type="monotone"
                                                dataKey="users"
                                                name="Jobs"
                                                stroke="#0E9FD8FF"
                                                fill="#033BD650"
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
                {/* <div className="pt-2">
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
                </div> */}
            </div>
        </AppLayout>
    );
}
