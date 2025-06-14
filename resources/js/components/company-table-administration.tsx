import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Eye, FileText, Image } from 'lucide-react';

// Assessment User interface definition
export interface AssessmentUser {
    id: string;
    name: string;
    email: string;
    position: string;
    registration_date: string;
    cv: {
        filename: string;
        fileType: 'pdf' | 'jpg' | 'png';
        url: string;
    };
    periodId: string;
    vacancy: string;
    status?: 'pending' | 'in_progress' | 'completed' | 'rejected';
    score?: number;
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

    const getCvIcon = (fileType: string) => {
        switch (fileType) {
            case 'pdf':
                return <FileText size={12} className="mr-1" />;
            case 'jpg':
            case 'png':
                return <Image size={12} className="mr-1" />;
            default:
                return <FileText size={12} className="mr-1" />;
        }
    };

    const getCvBadgeClass = (fileType: string) => {
        switch (fileType) {
            case 'pdf':
                return 'bg-red-100 text-red-600 border border-red-200';
            case 'jpg':
                return 'bg-green-100 text-green-600 border border-green-200';
            case 'png':
                return 'bg-blue-100 text-blue-600 border border-blue-200';
            default:
                return 'bg-gray-100 text-gray-600 border border-gray-200';
        }
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
            case 'in_progress':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
            default:
                return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Unknown</Badge>;
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
                            <TableHead className="w-[200px] py-3">Name</TableHead>
                            <TableHead className="w-[220px] py-3">Email</TableHead>
                            <TableHead className="w-[120px] py-3">Position</TableHead>
                            {/* CV Column - Hidden but not deleted */}
                            {/* <TableHead className="w-[150px] py-3">CV</TableHead> */}
                            {/* Status Column - Hidden but not deleted */}
                            {/* <TableHead className="w-[120px] py-3">Status</TableHead> */}
                            <TableHead className="w-[100px] py-3">Score</TableHead>
                            <TableHead className="w-[140px] py-3">Registration</TableHead>
                            <TableHead className="w-[80px] py-3 text-center">Action</TableHead>
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
                                        <TableCell className="w-[200px]">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                        <TableCell className="w-[220px]">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                        <TableCell className="w-[120px]">
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                        </TableCell>
                                        {/* CV Column Skeleton - Hidden but not deleted */}
                                        {/* <TableCell className="w-[150px]">
                                            <Skeleton className="h-6 w-20 rounded" />
                                        </TableCell> */}
                                        {/* Status Column Skeleton - Hidden but not deleted */}
                                        {/* <TableCell className="w-[120px]">
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                        </TableCell> */}
                                        <TableCell className="w-[100px]">
                                            <Skeleton className="h-4 w-12" />
                                        </TableCell>
                                        <TableCell className="w-[140px]">
                                            <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell className="w-[80px] text-center">
                                            <div className="flex justify-center">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                        ) : users.length > 0 ? (
                            users.map((user, index) => (
                                <TableRow key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                                    <TableCell className="whitespace-nowrap">{String(user.id).padStart(2, '0')}</TableCell>
                                    <TableCell className="font-medium whitespace-nowrap">{user.name}</TableCell>
                                    <TableCell className="break-all whitespace-nowrap md:break-normal">{user.email}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.position}</TableCell>
                                    {/* CV Column Data - Hidden but not deleted */}
                                    {/* <TableCell className="whitespace-nowrap">
                                        <a
                                            href={user.cv.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getCvBadgeClass(
                                                    user.cv.fileType
                                                )}`}
                                            >
                                                {getCvIcon(user.cv.fileType)}
                                                {user.cv.fileType.toUpperCase()}
                                            </span>
                                            <span className="ml-2 truncate max-w-[80px]" title={user.cv.filename}>
                                                {user.cv.filename}
                                            </span>
                                        </a>
                                    </TableCell> */}
                                    {/* Status Column Data - Hidden but not deleted */}
                                    {/* <TableCell className="whitespace-nowrap">
                                        {getStatusBadge(user.status)}
                                    </TableCell> */}
                                    <TableCell className="whitespace-nowrap">
                                        {user.score !== undefined ? `${user.score}/100` : '-'}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {user.registration_date ? format(new Date(user.registration_date), 'MMM dd, yyyy') : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => onView(user.id)}
                                                className="rounded-full p-1.5 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
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
                                    No candidates found.
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