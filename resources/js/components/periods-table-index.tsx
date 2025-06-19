import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Edit, Eye, Trash2 } from 'lucide-react';

// Vacancy interface
export interface VacancyItem {
    id: number;
    title: string;
    department: string;
    company?: {
        id: number;
        name: string;
    };
}

// Company interface
export interface CompanyItem {
    id: number;
    name: string;
}

// Period interface aligned with index.tsx
export interface Period {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    status: string;
    description?: string;
    title?: string;
    department?: string;
    questionPack?: string;
    applicantsCount?: number;
    vacanciesList?: VacancyItem[];
    companies?: CompanyItem[];
}

interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface PeriodsTableProps {
    periods: Period[];
    pagination: PaginationData;
    onView: (periodId: string) => void;
    onEdit: (periodId: string) => void;
    onDelete: (periodId: string) => void;
    onSelect: (periodId: string) => void;
    selectedPeriodId: string | null;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    isLoading: boolean;
    // Add new navigation handlers
    onNavigateToAssessment?: (periodId: string) => void;
    onNavigateToInterview?: (periodId: string) => void;
    onNavigateToReports?: (periodId: string) => void;
}

// Helper function to format dates
const formatSimpleDate = (dateString: string) => {
    if (!dateString) return '-';
    
    try {
        // If already in DD/MM/YYYY format, return as is
        if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
            return dateString;
        }
        
        // Handle ISO date strings
        if (dateString.includes('T') || dateString.includes('-')) {
            const parts = dateString.split(/[-T]/);
            if (parts.length >= 3) {
                const year = parts[0];
                const month = parts[1];
                const day = parts[2].split(':')[0].split(' ')[0];
                return `${day}/${month}/${year}`;
            }
        }
        
        return dateString;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

// Options for items per page in pagination
const itemsPerPageOptions = [5, 10, 20, 50, 100];

export function PeriodsTable({
    periods,
    pagination,
    onView,
    onEdit,
    onDelete,
    onSelect,
    selectedPeriodId,
    onPageChange,
    onPerPageChange,
    isLoading,
    onNavigateToAssessment,
    onNavigateToInterview,
    onNavigateToReports,
}: PeriodsTableProps) {
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

    // Handle row click - navigate to administration page
    const handleRowClick = (periodId: string, event: React.MouseEvent) => {
        // Prevent navigation if clicking on action buttons
        if ((event.target as HTMLElement).closest('button')) {
            return;
        }
        
        onSelect(periodId);
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
                            <TableHead className="w-[120px] py-3">Start Date</TableHead>
                            <TableHead className="w-[120px] py-3">End Date</TableHead>
                            <TableHead className="w-[100px] py-3">Status</TableHead>
                            <TableHead className="w-[150px] py-3">Companies</TableHead>
                            <TableHead className="w-[100px] py-3">Applicants</TableHead>
                            <TableHead className="w-[140px] py-3 text-center">Action</TableHead>
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
                                        <TableCell className="w-[120px]">
                                            <Skeleton className="h-4 w-20" />
                                        </TableCell>
                                        <TableCell className="w-[120px]">
                                            <Skeleton className="h-4 w-20" />
                                        </TableCell>
                                        <TableCell className="w-[100px]">
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                        </TableCell>
                                        <TableCell className="w-[150px]">
                                            <Skeleton className="h-4 w-24" />
                                        </TableCell>
                                        <TableCell className="w-[100px]">
                                            <Skeleton className="h-4 w-8" />
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
                        ) : periods.length > 0 ? (
                            periods.map((period, index) => (
                                <TableRow 
                                    key={period.id} 
                                    onClick={(e) => handleRowClick(period.id, e)}
                                    className={`
                                        cursor-pointer transition-colors hover:bg-blue-100
                                        ${selectedPeriodId === period.id 
                                            ? 'bg-blue-100' 
                                            : index % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                                        }
                                    `}
                                >
                                    <TableCell className="whitespace-nowrap font-medium">
                                        {String(period.id).padStart(2, '0')}
                                    </TableCell>
                                    <TableCell className="font-medium whitespace-nowrap">
                                        {period.name}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {formatSimpleDate(period.startTime)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {formatSimpleDate(period.endTime)}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            period.status === 'Open' ? 'bg-green-100 text-green-800' : 
                                            period.status === 'Closed' ? 'bg-red-100 text-red-800' : 
                                            period.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {period.status || 'Not Set'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {period.companies && period.companies.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {period.companies.map((company, idx) => (
                                                    <span 
                                                        key={company.id}
                                                        className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700"
                                                    >
                                                        {company.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 text-sm">No companies</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {period.applicantsCount || 0}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center space-x-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent row click
                                                    onView(period.id);
                                                }}
                                                className="rounded-full p-1.5 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                                            >
                                                <Eye className="h-4.5 w-4.5" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent row click
                                                    onEdit(period.id);
                                                }}
                                                className="rounded-full p-1.5 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                                            >
                                                <Edit className="h-4.5 w-4.5" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent row click
                                                    onDelete(period.id);
                                                }}
                                                className="rounded-full p-1.5 text-red-500 hover:bg-red-100 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4.5 w-4.5" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="py-4 text-center">
                                    No periods found
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