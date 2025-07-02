// job-table.tsx

import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PaginationData } from '@/types/user';
import { EyeIcon, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

export interface Job {
    id: number;
    title: string;
    department_id?: number;
    major_id?: number;
    location: string;
    salary?: string;
    company?: { id: number; name: string };
    company_id?: number | string;
    education_level_id?: number;
    question_pack_id?: number | null;
    requirements: string[];
    benefits?: string[];
    created_at: string;
    updated_at: string;
    status?: string;
    start_date?: string;
    departement?: { id: number; name: string };
    major?: { id: number; name: string };
    educationLevel?: { id: number; name: string };
    questionPack?: {
        id: number;
        pack_name: string;
        description?: string;
        test_type?: string;
        duration?: number;
    };
}

interface JobTableProps {
    jobs: Job[];
    isLoading?: boolean;
    onView: (jobId: number) => void;
    onEdit: (jobId: number) => void;
    onDelete: (jobId: number) => void;
    perPage?: number;
}

export function JobTable({
    jobs,
    isLoading = false,
    onView,
    onEdit,
    onDelete,
    perPage = 10,
}: JobTableProps) {
    // Function to format date to a simple format
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        try {
            return format(parseISO(dateString), 'dd/MM/yyyy');
        } catch (error) {
            return dateString; // Return original if parsing fails
        }
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto rounded-md border border-gray-200">
                <Table className="min-w-full bg-blue-50 [&_tr:hover]:bg-transparent">
                    <TableHeader className="bg-blue-50 [&_tr:hover]:bg-transparent">
                        <TableRow className="hover:bg-transparent [&>th]:hover:bg-transparent">
                            <TableHead className="w-[60px] py-3">ID</TableHead>
                            <TableHead className="w-[200px] py-3">Title</TableHead>
                            <TableHead className="w-[180px] py-3">Department</TableHead>
                            <TableHead className="w-[180px] py-3">Major</TableHead>
                            <TableHead className="w-[180px] py-3">Location</TableHead>
                            <TableHead className="w-[180px] py-3">Salary</TableHead>
                            <TableHead className="w-[180px] py-3">Company</TableHead>
                            <TableHead className="w-[180px] py-3">Question Packs</TableHead>
                            <TableHead className="w-[140px] py-3 text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array(perPage)
                                .fill(0)
                                .map((_, idx) => (
                                    <TableRow key={`skeleton-${idx}`}>
                                        <TableCell className="w-[60px]">
                                            <Skeleton className="h-4 w-8" />
                                        </TableCell>
                                        <TableCell className="w-[200px]">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                        <TableCell className="w-[180px]">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                        <TableCell className="w-[180px]">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                        <TableCell className="w-[180px]">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                        <TableCell className="w-[180px]">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                        <TableCell className="w-[140px]">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                        <TableCell className="w-[140px] text-center">
                                            <div className="flex justify-center space-x-2">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : jobs.length > 0 ? (
                            jobs.map((job, index) => (
                                <TableRow key={job.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                                    <TableCell className="whitespace-nowrap">{String(job.id).padStart(2, '0')}</TableCell>
                                    <TableCell className="whitespace-nowrap">{job.title}</TableCell>
                                    <TableCell className="whitespace-nowrap">{job.departement?.name || '-'}</TableCell>
                                    <TableCell className="whitespace-nowrap">{job.major?.name || '-'}</TableCell>
                                    <TableCell className="whitespace-nowrap">{job.location}</TableCell>
                                    <TableCell className="whitespace-nowrap">{job.salary || '-'}</TableCell>
                                    <TableCell className="whitespace-nowrap">{job.company?.name || '-'}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {job.questionPack && job.questionPack.pack_name ? (
                                            <Badge variant="default">
                                                {job.questionPack.pack_name}
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">None</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center space-x-3">
                                            <button
                                                onClick={() => onView(job.id)}
                                                className="rounded-full p-1.5 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                                            >
                                                <EyeIcon className="h-4.5 w-4.5" />
                                            </button>
                                            <button
                                                onClick={() => onEdit(job.id)}
                                                className="rounded-full p-1.5 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                                            >
                                                <Pencil className="h-4.5 w-4.5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(job.id)}
                                                className="rounded-full p-1.5 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                                            >
                                                <Trash2 className="h-4.5 w-4.5" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="py-4 text-center">
                                    No jobs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
