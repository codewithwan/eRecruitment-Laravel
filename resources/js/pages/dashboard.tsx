import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import WeeklyTrafficTrends from '@/components/weekly-traffic-trends';
import MonthlyApplicationsChart from '@/components/monthly-applications-chart';
import PositionAnalyticsChart from '@/components/position-analytics-chart';
import CandidateList from '@/components/candidate-list';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Dummy recruitment traffic data
const trafficData = [
    {
        id: 1,
        position: "Frontend Developer",
        applicants: 87,
        views: 254,
        conversion: "34.2%",
        status: "Active",
        lastUpdated: "2 hours ago"
    },
    {
        id: 2,
        position: "UI/UX Designer",
        applicants: 64,
        views: 198,
        conversion: "32.3%",
        status: "Active",
        lastUpdated: "5 hours ago"
    },
    {
        id: 3,
        position: "Backend Engineer",
        applicants: 92,
        views: 312,
        conversion: "29.5%",
        status: "Active",
        lastUpdated: "1 day ago"
    },
    {
        id: 4,
        position: "Project Manager",
        applicants: 46,
        views: 187,
        conversion: "24.6%",
        status: "Closed",
        lastUpdated: "2 days ago"
    },
    {
        id: 5,
        position: "DevOps Engineer",
        applicants: 34,
        views: 145,
        conversion: "23.4%",
        status: "Active",
        lastUpdated: "3 days ago"
    },
];

// Data for monthly applications
const monthlyApplicationsData = [
    { name: 'Jan', applications: 45 },
    { name: 'Feb', applications: 52 },
    { name: 'Mar', applications: 68 },
    { name: 'Apr', applications: 74 },
    { name: 'May', applications: 92 },
    { name: 'Jun', applications: 85 },
];

// Data for position comparison
const positionComparisonData = trafficData.map(item => ({
    name: item.position,
    applicants: item.applicants,
    views: item.views
}));

export default function Dashboard() {
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const toggleRowExpansion = (rowId: number) => {
        setExpandedRows(prev =>
            prev.includes(rowId)
                ? prev.filter(id => id !== rowId)
                : [...prev, rowId]
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Analytics Overview Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Analytics Overview</h2>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        {/* Chart Cards */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Monthly Applications</CardTitle>
                                <CardDescription>Application trends over the last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <MonthlyApplicationsChart data={monthlyApplicationsData} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Position Analytics</CardTitle>
                                <CardDescription>Applicants vs. Views comparison</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <PositionAnalyticsChart data={positionComparisonData} />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recruitment Traffic Section */}
                <div className="pt-2">
                    <h2 className="text-2xl font-semibold mb-4">Recruitment Traffic</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Posting Performance</CardTitle>
                            <CardDescription>
                                Overview of job postings traffic and application conversion rates. Click on a row to see detailed weekly trends.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-8"></TableHead>
                                        <TableHead>Position</TableHead>
                                        <TableHead className="text-right">Applicants</TableHead>
                                        <TableHead className="text-right">Views</TableHead>
                                        <TableHead className="text-right">Conversion</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Last Updated</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trafficData.map((item) => (
                                        <>
                                            <TableRow
                                                key={item.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => toggleRowExpansion(item.id)}
                                            >
                                                <TableCell>
                                                    {expandedRows.includes(item.id) ? (
                                                        <ChevronUp className="size-4" />
                                                    ) : (
                                                        <ChevronDown className="size-4" />
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">{item.position}</TableCell>
                                                <TableCell className="text-right">{item.applicants}</TableCell>
                                                <TableCell className="text-right">{item.views}</TableCell>
                                                <TableCell className="text-right">{item.conversion}</TableCell>
                                                <TableCell>
                                                    <Badge variant={item.status === "Active" ? "default" : "secondary"}>
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">{item.lastUpdated}</TableCell>
                                            </TableRow>
                                            {expandedRows.includes(item.id) && (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="p-4 bg-muted/40">
                                                        <WeeklyTrafficTrends position={item.position} positionId={item.id} />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* User List Section */}
                <div className="pt-2">
                    <h2 className="text-2xl font-semibold mb-4">Candidate List</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Candidate Details</CardTitle>
                            <CardDescription>
                                List of candidate with detailed information. Click on a row to see user details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CandidateList />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
