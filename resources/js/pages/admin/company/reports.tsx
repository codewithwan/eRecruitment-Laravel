import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Eye, ThumbsUp, ThumbsDown, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { Pagination } from '@/components/ui/pagination';
import { useState } from 'react';
import StageActionDialog from '@/components/stage-action-dialog';

interface Props {
    candidates: {
        data: Array<{
            id: number;
            user: {
                name: string;
                email: string;
            };
            scores: {
                administration: number | null;
                assessment: number | null;
                interview: number | null;
                average: number | null;
            };
            status: {
                name: string;
                code: string;
            };
            vacancy_period: {
                vacancy: {
                    title: string;
                };
            };
        }>;
        current_page: number;
        per_page: number;
        last_page: number;
        total: number;
    };
    filters?: {
        company?: string;
        period?: string;
        sort?: string;
        order?: 'asc' | 'desc';
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
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/dashboard/recruitment/reports' },
];

export default function Reports({ candidates, filters, companyInfo, periodInfo }: Props) {
    const [actionDialog, setActionDialog] = useState<{
        isOpen: boolean;
        action: 'accept' | 'reject';
        candidateId: number;
    } | null>(null);

    const handleSort = (column: string) => {
        const newOrder = filters?.sort === column && filters.order === 'asc' ? 'desc' : 'asc';
        router.visit('/dashboard/recruitment/reports', {
            data: { 
                ...(filters || {}), 
                sort: column,
                order: newOrder
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.visit('/dashboard/recruitment/reports', {
            data: { ...(filters || {}), page },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getSortIcon = (column: string) => {
        if (filters?.sort !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
        return filters.order === 'asc' ? 
            <ArrowUpDown className="ml-2 h-4 w-4 text-primary" /> : 
            <ArrowUpDown className="ml-2 h-4 w-4 text-primary rotate-180" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Navigation Menu */}
                <div className="flex w-full border-b">
                    <button
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                        onClick={() => router.visit('/dashboard/recruitment/administration', {
                            data: { company: filters?.company, period: filters?.period }
                        })}
                    >
                        Administration
                    </button>
                    <button
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                        onClick={() => router.visit('/dashboard/recruitment/assessment', {
                            data: { company: filters?.company, period: filters?.period }
                        })}
                    >
                        Assessment
                    </button>
                    <button
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                        onClick={() => router.visit('/dashboard/recruitment/interview', {
                            data: { company: filters?.company, period: filters?.period }
                        })}
                    >
                        Interview
                    </button>
                    <button
                        className="flex-1 border-b-2 border-primary px-4 py-2 text-sm font-medium text-primary"
                        onClick={() => router.visit('/dashboard/recruitment/reports', {
                            data: { company: filters?.company, period: filters?.period }
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
                        <h2 className="text-2xl font-semibold">Recruitment Reports</h2>
                        <div className="text-sm text-muted-foreground">
                            Total: {candidates.total} candidates
                        </div>
                    </div>
                        <Card>
                            <CardHeader>
                            <CardTitle>Candidates Report</CardTitle>
                            <CardDescription>View and manage candidates final reports</CardDescription>
                            </CardHeader>
                            <CardContent>
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted text-muted-foreground">
                                        <tr>
                                            <th className="p-4 font-medium">No</th>
                                            <th className="p-4 font-medium">
                                                <button 
                                                    className="flex items-center"
                                                    onClick={() => handleSort('name')}
                                                >
                                                    Name {getSortIcon('name')}
                                                </button>
                                            </th>
                                            <th className="p-4 font-medium">Email</th>
                                            <th className="p-4 font-medium">Position</th>
                                            <th className="p-4 font-medium">
                                                <button 
                                                    className="flex items-center"
                                                    onClick={() => handleSort('administration_score')}
                                                >
                                                    Administration {getSortIcon('administration_score')}
                                                </button>
                                            </th>
                                            <th className="p-4 font-medium">
                                                <button 
                                                    className="flex items-center"
                                                    onClick={() => handleSort('assessment_score')}
                                                >
                                                    Assessment {getSortIcon('assessment_score')}
                                                </button>
                                            </th>
                                            <th className="p-4 font-medium">
                                                <button 
                                                    className="flex items-center"
                                                    onClick={() => handleSort('interview_score')}
                                                >
                                                    Interview {getSortIcon('interview_score')}
                                                </button>
                                            </th>
                                            <th className="p-4 font-medium">
                                                <button 
                                                    className="flex items-center"
                                                    onClick={() => handleSort('average_score')}
                                                >
                                                    Average {getSortIcon('average_score')}
                                                </button>
                                            </th>
                                            <th className="p-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {candidates.data.length > 0 ? (
                                            candidates.data.map((candidate, index) => (
                                                <tr key={candidate.id} className="border-b">
                                                    <td className="p-4">
                                                        {(candidates.current_page - 1) * candidates.per_page + index + 1}
                                                    </td>
                                                    <td className="p-4">{candidate.user.name}</td>
                                                    <td className="p-4">{candidate.user.email}</td>
                                                    <td className="p-4">{candidate.vacancy_period.vacancy.title}</td>
                                                    <td className="p-4">
                                                        {candidate.scores.administration !== null ? 
                                                            candidate.scores.administration.toFixed(2) : '-'}
                                                    </td>
                                                    <td className="p-4">
                                                        {candidate.scores.assessment !== null ? 
                                                            candidate.scores.assessment.toFixed(2) : '-'}
                                                    </td>
                                                    <td className="p-4">
                                                        {candidate.scores.interview !== null ? 
                                                            candidate.scores.interview.toFixed(2) : '-'}
                                                    </td>
                                                    <td className="p-4">
                                                        {candidate.scores.average !== null ? 
                                                            candidate.scores.average.toFixed(2) : '-'}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => {
                                                                    router.get(`/dashboard/recruitment/reports/${candidate.id}`);
                                                                }}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => setActionDialog({
                                                                    isOpen: true,
                                                                    action: 'reject',
                                                                    candidateId: candidate.id
                                                                })}
                                                            >
                                                                <ThumbsDown className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => setActionDialog({
                                                                    isOpen: true,
                                                                    action: 'accept',
                                                                    candidateId: candidate.id
                                                                })}
                                                            >
                                                                <ThumbsUp className="h-4 w-4" />
                                                            </Button>
                                    </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={9} className="p-4 text-center text-muted-foreground">
                                                    No candidates found
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

                {/* Stage Action Dialog */}
                {actionDialog && (
                    <StageActionDialog
                        isOpen={actionDialog.isOpen}
                        onClose={() => setActionDialog(null)}
                        applicationId={actionDialog.candidateId}
                        stage="final"
                        action={actionDialog.action}
                        title={actionDialog.action === 'accept' ? 'Accept Candidate' : 'Reject Application'}
                        description={
                            actionDialog.action === 'accept'
                                ? 'Are you sure you want to accept this candidate? This will mark them as hired.'
                                : 'The candidate will be rejected from the recruitment process. Please provide a reason for rejection.'
                        }
                    />
                )}
            </div>
        </AppLayout>
    );
} 