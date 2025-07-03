import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Eye, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { InterviewScheduleModal } from '@/components/interview-schedule-modal';

// Assessment User interface definition
export interface AssessmentUser {
    id: string;
    name: string;
    email: string;
    position: string;
    periodId: string;
    vacancy: string;
    assigned_date?: string;    // tanggal diberi soal
    submitted_date?: string;   // tanggal dikerjakan
    total_score?: number;      // nilai yang diperoleh
    max_total_score?: number;  // nilai maksimal
}

interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface AssessmentTableProps {
    users: AssessmentUser[];
    pagination: PaginationData;
    onView?: (id: string) => void;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    itemsPerPageOptions?: number[];
    isLoading?: boolean;
}

export function AssessmentTable({
    users,
    pagination,
    onView = (id) => console.log('View user:', id),
    onPageChange,
    onPerPageChange,
    itemsPerPageOptions = [10, 25, 50, 100],
    isLoading = false,
}: AssessmentTableProps) {
    // Tambahkan state untuk modal
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewLink, setInterviewLink] = useState('');
    const [interviewNote, setInterviewNote] = useState('');

    const handleOpenApproveModal = (user: AssessmentUser) => {
        setInterviewDate('');
        setInterviewLink('');
        setInterviewNote('');
        setIsApproveModalOpen(true);
    };

    const handleCloseApproveModal = () => {
        setIsApproveModalOpen(false);
        setInterviewDate('');
        setInterviewLink('');
        setInterviewNote('');
    };

    const handleSubmitApprove = (e: React.FormEvent) => {
        e.preventDefault();
        // Lakukan aksi simpan interviewDate, interviewLink, interviewNote
        setIsApproveModalOpen(false);
    };

    const handleNextPage = () => {
        if (pagination.current_page < pagination.last_page) {
            onPageChange(pagination.current_page + 1);
        }
    };

    const handlePrevPage = () => {
        if (pagination.current_page > 1) {
            onPageChange(pagination.current_page - 1);
        }
    };

    const handleItemsPerPageChange = (value: string) => {
        onPerPageChange(Number(value));
    };

    return (
        <div className="w-full">
            {/* Responsive table container with horizontal scroll */}
            <div className="overflow-x-auto rounded-md border border-gray-200">
                <Table className="min-w-full bg-blue-50 [&_tr:hover]:bg-transparent">
                    <TableHeader className="bg-blue-50 [&_tr:hover]:bg-transparent">
                        <TableRow className="hover:bg-transparent [&>th]:hover:bg-transparent">
                            <TableHead className="w-[60px] py-3">ID</TableHead>
                            <TableHead className="w-[180px] py-3">Name</TableHead>
                            <TableHead className="w-[200px] py-3">Email</TableHead>
                            <TableHead className="w-[140px] py-3">Position</TableHead>
                            <TableHead className="w-[120px] py-3">Assigned</TableHead>
                            <TableHead className="w-[120px] py-3">Submitted</TableHead>
                            <TableHead className="w-[100px] py-3 text-center">Score</TableHead>
                            <TableHead className="w-[100px] py-3 text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Skeleton loading rows
                            Array(pagination.per_page)
                                .fill(0)
                                .map((_, idx) => (
                                    <TableRow key={`skeleton-${idx}`}>
                                        <TableCell className="w-[60px]">
                                            <Skeleton className="h-4 w-8" />
                                        </TableCell>
                                        <TableCell className="w-[180px]">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                        <TableCell className="w-[200px]">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                        <TableCell className="w-[140px]">
                                            <Skeleton className="h-4 w-20" />
                                        </TableCell>
                                        <TableCell className="w-[120px]">
                                            <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell className="w-[120px]">
                                            <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell className="w-[100px] text-center">
                                            <div className="flex justify-center">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : users.length > 0 ? (
                            users.map((user, index) => (
                                <TableRow key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                                    <TableCell className="whitespace-nowrap">{String(parseInt(user.id)).padStart(2, '0')}</TableCell>
                                    <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                                    <TableCell className="break-all whitespace-nowrap md:break-normal">{user.email}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.position}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {user.assigned_date ? format(new Date(user.assigned_date), 'MMM dd, yyyy') : '-'}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {user.submitted_date ? format(new Date(user.submitted_date), 'MMM dd, yyyy') : '-'}
                                    </TableCell>
                                    <TableCell className="text-center font-semibold">
                                        {(user.total_score != null && user.max_total_score != null && user.max_total_score > 0)
                                            ? `${Math.round((user.total_score / user.max_total_score) * 100)}%`
                                            : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => onView(user.id)}
                                                className="rounded-full p-1.5 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                                                title="View Details"
                                            >
                                                <Eye className="h-4.5 w-4.5" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="py-4 text-center">
                                    No assessment data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Responsive pagination controls */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Show</span>
                    <Select value={pagination.per_page.toString()} onValueChange={handleItemsPerPageChange} disabled={isLoading}>
                        <SelectTrigger className="h-8 w-16 rounded border border-blue-300 text-blue-300">
                            <SelectValue placeholder={pagination.per_page.toString()} />
                        </SelectTrigger>
                        <SelectContent className="border border-blue-500">
                            {itemsPerPageOptions.map((option) => (
                                <SelectItem
                                    key={option}
                                    value={option.toString()}
                                    className="text-blue-300 hover:bg-blue-50 focus:bg-blue-50 focus:text-blue-500"
                                >
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-500">per page</span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handlePrevPage}
                        disabled={pagination.current_page === 1 || isLoading}
                        className="flex items-center justify-center rounded-md border border-blue-500 px-2 py-1 text-blue-500 hover:bg-blue-100 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Responsive page numbers */}
                    {Array.from({ length: Math.min(5, pagination.last_page) }).map((_, idx) => {
                        const pageNumber = Math.max(1, pagination.current_page - 2) + idx;
                        if (pageNumber > pagination.last_page) return null;
                        
                        const isActive = pageNumber === pagination.current_page;
                        const isVisible =
                            pageNumber === 1 ||
                            pageNumber === pagination.last_page ||
                            isActive ||
                            Math.abs(pageNumber - pagination.current_page) <= 1;

                        return (
                            <button
                                key={pageNumber}
                                onClick={() => onPageChange(pageNumber)}
                                disabled={isLoading}
                                className={`flex h-8 min-w-[32px] items-center justify-center rounded-md px-2 ${
                                    isActive ? 'bg-blue-500 text-white' : 'border border-blue-500 bg-white text-blue-500 hover:bg-blue-100'
                                } ${!isVisible ? 'hidden sm:flex' : ''}`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        onClick={handleNextPage}
                        disabled={pagination.current_page === pagination.last_page || isLoading}
                        className="flex items-center justify-center rounded-md border border-blue-500 px-2 py-1 text-blue-500 hover:bg-blue-100 disabled:opacity-50"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                <div className="text-center text-sm text-gray-500 sm:text-right">
                    Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{' '}
                    {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} entries
                </div>
            </div>

            {/* Modal Approve Interview */}
            <InterviewScheduleModal
                open={isApproveModalOpen}
                onOpenChange={setIsApproveModalOpen}
                interviewDate={interviewDate}
                setInterviewDate={setInterviewDate}
                interviewLink={interviewLink}
                setInterviewLink={setInterviewLink}
                interviewNote={interviewNote}
                setInterviewNote={setInterviewNote}
                onSubmit={handleSubmitApprove}
                isLoading={isLoading}
            />
        </div>
    );
}