import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ApplicationInfo } from '@/types';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format, formatDistanceStrict } from 'date-fns';
import { Pagination } from '@/components/ui/pagination';

interface Props {
    candidates: {
        data: ApplicationInfo[];
        current_page: number;
        per_page: number;
        last_page: number;
        total: number;
    };
    filters?: {
        company?: string;
        period?: string;
    };
    companyInfo?: {
        name: string;
    };
    periodInfo?: {
        name: string;
        start_date: string;
        end_date: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Assessment',
        href: '/dashboard/recruitment/assessment',
    },
];

export default function Assessment({ candidates, filters, companyInfo, periodInfo }: Props) {
    const handlePageChange = (page: number) => {
        router.visit('/dashboard/recruitment/assessment', {
            data: { ...(filters || {}), page },
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assessment" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Navigation Menu */}
                <div className="flex w-full border-b">
                    <button
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                        onClick={() => router.visit('/dashboard/recruitment/administration', { 
                            data: filters || {},
                            preserveState: true,
                            preserveScroll: true
                        })}
                    >
                        Administration
                    </button>
                    <button
                        className="flex-1 border-b-2 border-primary px-4 py-2 text-sm font-medium text-primary"
                        onClick={() => router.visit('/dashboard/recruitment/assessment', { 
                            data: filters || {},
                            preserveState: true,
                            preserveScroll: true
                        })}
                    >
                        Assessment
                    </button>
                    <button
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                        onClick={() => router.visit('/dashboard/recruitment/interview', { 
                            data: filters || {},
                            preserveState: true,
                            preserveScroll: true
                        })}
                    >
                        Interview
                    </button>
                    <button
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                        onClick={() => router.visit('/dashboard/recruitment/reports', { 
                            data: filters || {},
                            preserveState: true,
                            preserveScroll: true
                        })}
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
                        <h2 className="text-2xl font-semibold">Assessment Stage</h2>
                        <div className="text-sm text-muted-foreground">
                            Total: {candidates.total} candidates
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Candidates List</CardTitle>
                            <CardDescription>View and manage candidates in assessment stage</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted text-muted-foreground">
                                        <tr>
                                            <th className="p-4 font-medium">No</th>
                                            <th className="p-4 font-medium">Name</th>
                                            <th className="p-4 font-medium">Email</th>
                                            <th className="p-4 font-medium">Position</th>
                                            <th className="p-4 font-medium">Started At</th>
                                            <th className="p-4 font-medium">Completed At</th>
                                            <th className="p-4 font-medium">Duration</th>
                                            <th className="p-4 font-medium">Score</th>
                                            <th className="p-4 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {candidates.data.length > 0 ? (
                                            candidates.data.map((candidate, index) => {
                                                const startedAt = candidate.history?.[0]?.processed_at;
                                                const completedAt = candidate.history?.[0]?.completed_at;
                                                const duration = startedAt && completedAt ? 
                                                    formatDistanceStrict(new Date(completedAt), new Date(startedAt)) : 
                                                    '-';
                                                
                                                return (
                                                    <tr key={candidate.id} className="border-b">
                                                        <td className="p-4">{(candidates.current_page - 1) * candidates.per_page + index + 1}</td>
                                                        <td className="p-4">{candidate.user.name}</td>
                                                        <td className="p-4">{candidate.user.email}</td>
                                                        <td className="p-4">{candidate.vacancy_period.vacancy.title}</td>
                                                        <td className="p-4">
                                                            {startedAt ? format(new Date(startedAt), 'dd MMM yyyy HH:mm') : '-'}
                                                        </td>
                                                        <td className="p-4">
                                                            {completedAt ? format(new Date(completedAt), 'dd MMM yyyy HH:mm') : '-'}
                                                        </td>
                                                        <td className="p-4">{duration}</td>
                                                        <td className="p-4">{candidate.stages?.psychological_test?.score || '-'}</td>
                                                        <td className="p-4">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => {
                                                                    router.get(`/dashboard/recruitment/assessment/${candidate.id}`);
                                                                }}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={9} className="p-4 text-center text-muted-foreground">
                                                    No candidates found in assessment stage
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {candidates.last_page > 1 && (
                                <div className="mt-4 flex justify-center">
                                    <Pagination
                                        currentPage={candidates.current_page}
                                        totalPages={candidates.last_page}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 