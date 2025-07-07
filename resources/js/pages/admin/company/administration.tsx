import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Pagination } from '@/components/ui/pagination';


interface Props {
    candidates: {
        data: Array<{
            id: number;
            user: {
                name: string;
                email: string;
            };
            vacancy_period: {
                vacancy: {
                    title: string;
                };
            };
            created_at: string;
        }>;
        current_page: number;
        last_page: number;
        per_page: number;
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
        title: 'Administration',
        href: '/dashboard/company/administration',
    },
];

export default function Administration({ candidates, filters, companyInfo, periodInfo }: Props) {
    console.log('Pagination Info:', {
        currentPage: candidates.current_page,
        lastPage: candidates.last_page,
        total: candidates.total,
        perPage: candidates.per_page
    });

    const formatDate = (date: string) => {
        try {
            return format(new Date(date), 'dd/MM/yyyy HH:mm');
        } catch (error) {
            console.error('Error formatting date:', error);
            return '-';
        }
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/dashboard/recruitment/administration',
            {
                ...(filters || {}),
                page,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const mappedCandidates = candidates.data.map(item => {
        console.log('Raw candidate item:', item);
        const mapped = {
            id: item.id,
            name: item.user?.name || 'N/A',
            email: item.user?.email || 'N/A',
            position: item.vacancy_period?.vacancy?.title || 'N/A',
            applied_at: item.created_at
        };
        console.log('Mapped candidate:', mapped);
        return mapped;
    });

    console.log('Total candidates:', candidates.total);
    console.log('Current page:', candidates.current_page);
    console.log('Per page:', candidates.per_page);
    console.log('Last page:', candidates.last_page);
    console.log('Mapped candidates length:', mappedCandidates.length);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Administration" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Navigation Menu */}
                <div className="flex w-full border-b">
                    <button
                        className="flex-1 border-b-2 border-primary px-4 py-2 text-sm font-medium text-primary"
                        onClick={() => router.visit('/dashboard/recruitment/administration', { 
                            data: filters || {},
                            preserveState: true,
                            preserveScroll: true
                        })}
                    >
                        Administration
                    </button>
                    <button
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
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
                        <h2 className="text-2xl font-semibold">Administration Stage</h2>
                        <div className="text-sm text-muted-foreground">
                            Total: {candidates.total} candidates
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Candidates List</CardTitle>
                            <CardDescription>View and manage candidates in administration stage</CardDescription>
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
                                            <th className="p-4 font-medium">Applied Date</th>
                                            <th className="p-4 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mappedCandidates.length > 0 ? (
                                            mappedCandidates.map((candidate, index) => (
                                                <tr key={candidate.id} className="border-b">
                                                    <td className="p-4">{(candidates.current_page - 1) * candidates.per_page + index + 1}</td>
                                                    <td className="p-4">{candidate.name}</td>
                                                    <td className="p-4">{candidate.email}</td>
                                                    <td className="p-4">{candidate.position}</td>
                                                    <td className="p-4">{formatDate(candidate.applied_at)}</td>
                                                    <td className="p-4">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => {
                                                                router.get(`/dashboard/recruitment/administration/${candidate.id}`);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                    No candidates found in administration stage
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