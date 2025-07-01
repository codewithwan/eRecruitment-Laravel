import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

// Interview User interface definition
export interface InterviewUser {
    id: string;
    name: string;
    email: string;
    position: string;
    periodId?: string;
    vacancy?: string;
    status?: 'pending' | 'scheduled' | 'completed' | 'rejected';
}

interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface InterviewTableProps {
    users: InterviewUser[];
    pagination: PaginationData;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onApprove?: (id: string) => void;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    itemsPerPageOptions?: number[];
    isLoading?: boolean;
}

export function InterviewTable({
    users,
    pagination,
    onView = (id) => console.log('View user:', id),
    onEdit = (id) => console.log('Edit user:', id),
    onDelete = (id) => console.log('Delete user:', id),
    onApprove = (id) => console.log('Approve user:', id),
    onPageChange,
    onPerPageChange,
    itemsPerPageOptions = [10, 25, 50, 100],
    isLoading = false,
}: InterviewTableProps) {
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

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
            case 'scheduled':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
            default:
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pending</Badge>;
        }
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
                            <TableHead className="w-[100px] py-3">Status</TableHead>
                            <TableHead className="w-[120px] py-3 text-center">Action</TableHead>
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
                                        <TableCell className="w-[140px]">
                                            <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell className="w-[100px]">
                                            <Skeleton className="h-4 w-20" />
                                        </TableCell>
                                        <TableCell className="w-[120px] text-center">
                                            <div className="flex justify-center">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : users.length > 0 ? (
                            users.map((user, index) => (
                                <TableRow key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                                    <TableCell className="whitespace-nowrap">
                                        {String(parseInt(user.id)).padStart(2, '0')}
                                    </TableCell>
                                    <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                                    <TableCell className="break-all whitespace-nowrap md:break-normal">{user.email}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.position}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {getStatusBadge(user.status)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
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
                                <TableCell colSpan={7} className="py-4 text-center">
                                    No interview candidates found.
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

                    {/* Responsive page numbers - hide some on small screens */}
                    {Array.from({ length: Math.min(5, pagination.last_page) }).map((_, idx) => {
                        const pageNumber = idx + 1;
                        const isActive = pageNumber === pagination.current_page;
                        // Only show first, last, and current page on small screens
                        const isVisible =
                            pageNumber === 1 ||
                            pageNumber === pagination.last_page ||
                            isActive ||
                            Math.abs(pageNumber - pagination.current_page) <= 1;

                        return (
                            <button
                                key={idx}
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
        </div>
    );
}