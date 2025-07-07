import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { format } from 'date-fns';

interface Props {
    companyInfo?: {
        name: string;
    };
    periodInfo?: {
        name: string;
        start_date: string;
        end_date: string;
    };
    statistics: {
        total_applicants: number;
        stages: {
            administration: {
                total: number;
                passed: number;
                failed: number;
                pending: number;
            };
            assessment: {
                total: number;
                completed: number;
                in_progress: number;
                pending: number;
                average_score: number;
            };
            interview: {
                total: number;
                completed: number;
                scheduled: number;
                pending: number;
                passed: number;
                failed: number;
            };
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Reports',
        href: '/dashboard/recruitment/reports',
    },
];

export default function Reports({ companyInfo, periodInfo, statistics }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Navigation Menu */}
                <div className="flex w-full border-b">
                    <button
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                        onClick={() => router.get('/dashboard/recruitment/administration')}
                    >
                        Administration
                    </button>
                    <button
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                        onClick={() => router.get('/dashboard/recruitment/assessment')}
                    >
                        Assessment
                    </button>
                    <button
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                        onClick={() => router.get('/dashboard/recruitment/interview')}
                    >
                        Interview
                    </button>
                    <button
                        className="flex-1 border-b-2 border-primary px-4 py-2 text-sm font-medium text-primary"
                        onClick={() => router.get('/dashboard/recruitment/reports')}
                    >
                        Reports
                    </button>
                </div>

                {/* Company and Period Info */}
                {(companyInfo || periodInfo) && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                {companyInfo && (
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        {companyInfo.name}
                                    </h2>
                                )}
                                {periodInfo && (
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium">{periodInfo.name}</p>
                                        <p>
                                            Period: {format(new Date(periodInfo.start_date), 'dd MMM yyyy')} 
                                            {' - '} 
                                            {format(new Date(periodInfo.end_date), 'dd MMM yyyy')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Main Content */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Recruitment Reports</h2>
                        <div className="text-sm text-muted-foreground">
                            Total Applicants: {statistics.total_applicants}
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Administration Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Administration</CardTitle>
                                <CardDescription>Administrative selection statistics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <dl className="space-y-2">
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Total</dt>
                                        <dd className="text-sm font-medium">{statistics.stages.administration.total}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Passed</dt>
                                        <dd className="text-sm font-medium text-green-600">{statistics.stages.administration.passed}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Failed</dt>
                                        <dd className="text-sm font-medium text-red-600">{statistics.stages.administration.failed}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Pending</dt>
                                        <dd className="text-sm font-medium text-yellow-600">{statistics.stages.administration.pending}</dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </Card>

                        {/* Assessment Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Assessment</CardTitle>
                                <CardDescription>Psychological test statistics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <dl className="space-y-2">
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Total</dt>
                                        <dd className="text-sm font-medium">{statistics.stages.assessment.total}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Completed</dt>
                                        <dd className="text-sm font-medium text-green-600">{statistics.stages.assessment.completed}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">In Progress</dt>
                                        <dd className="text-sm font-medium text-yellow-600">{statistics.stages.assessment.in_progress}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Pending</dt>
                                        <dd className="text-sm font-medium text-gray-600">{statistics.stages.assessment.pending}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Average Score</dt>
                                        <dd className="text-sm font-medium text-blue-600">{statistics.stages.assessment.average_score}%</dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </Card>

                        {/* Interview Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Interview</CardTitle>
                                <CardDescription>Interview process statistics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <dl className="space-y-2">
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Total</dt>
                                        <dd className="text-sm font-medium">{statistics.stages.interview.total}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Completed</dt>
                                        <dd className="text-sm font-medium text-green-600">{statistics.stages.interview.completed}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Scheduled</dt>
                                        <dd className="text-sm font-medium text-blue-600">{statistics.stages.interview.scheduled}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Pending</dt>
                                        <dd className="text-sm font-medium text-gray-600">{statistics.stages.interview.pending}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Passed</dt>
                                        <dd className="text-sm font-medium text-green-600">{statistics.stages.interview.passed}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-600">Failed</dt>
                                        <dd className="text-sm font-medium text-red-600">{statistics.stages.interview.failed}</dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 