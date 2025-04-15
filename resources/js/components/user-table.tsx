import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from 'lucide-react';

// User interface definition
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}

interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface UserTableProps {
    users: User[];
    pagination: PaginationData;
    onView?: (userId: number) => void;
    onEdit?: (userId: number) => void;
    onDelete?: (userId: number) => void;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    itemsPerPageOptions?: number[];
    isLoading?: boolean;
}

export function UserTable({
    users,
    pagination,
    onView = (id) => console.log('View user:', id),
    onEdit = (id) => console.log('Edit user:', id),
    onDelete = (id) => console.log('Delete user:', id),
    onPageChange,
    onPerPageChange,
    itemsPerPageOptions = [10, 25, 50, 100],
    isLoading = false,
}: UserTableProps) {
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
                            <TableHead className="w-[100px] py-3">Role</TableHead>
                            <TableHead className="w-[100px] py-3">Verified</TableHead>
                            <TableHead className="w-[140px] py-3">Registration Date</TableHead>
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
                                        <TableCell className="w-[200px]">
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                        <TableCell className="w-[100px]">
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                        </TableCell>
                                        <TableCell className="w-[100px]">
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                        </TableCell>
                                        <TableCell className="w-[140px]">
                                            <Skeleton className="h-4 w-24" />
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
                        ) : users.length > 0 ? (
                            users.map((user, index) => (
                                <TableRow 
                                    key={user.id} 
                                    className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                                    style={{ pointerEvents: "none" }}
                                >
                                    <TableCell className="whitespace-nowrap">{String(user.id).padStart(2, '0')}</TableCell>
                                    <TableCell className="whitespace-nowrap font-medium">{user.name}</TableCell>
                                    <TableCell className="whitespace-nowrap break-all md:break-normal">{user.email}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.role}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.email_verified_at ? "Verified" : "Non Verified"}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center space-x-3">
                                            <button 
                                                onClick={() => onView(user.id)}
                                                className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full"
                                            >
                                                <Eye className="h-4.5 w-4.5" />
                                            </button>
                                            <button 
                                                onClick={() => onEdit(user.id)}
                                                className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full"
                                            >
                                                <Pencil className="h-4.5 w-4.5" />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(user.id)}
                                                className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full"
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
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Responsive pagination controls */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Show</span>
                    <Select value={pagination.per_page.toString()} onValueChange={handleItemsPerPageChange} disabled={isLoading}>
                        <SelectTrigger className="h-8 w-16 border border-blue-300 rounded text-blue-300">
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
                        className="rounded-md px-2 py-1 flex items-center justify-center text-blue-500 hover:bg-blue-100 disabled:opacity-50 border border-blue-500"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Responsive page numbers - hide some on small screens */}
                    {Array.from({ length: Math.min(5, pagination.last_page) }).map((_, idx) => {
                        const pageNumber = idx + 1;
                        const isActive = pageNumber === pagination.current_page;
                        // Only show first, last, and current page on small screens
                        const isVisible = pageNumber === 1 || 
                                        pageNumber === pagination.last_page || 
                                        isActive ||
                                        Math.abs(pageNumber - pagination.current_page) <= 1;
                        
                        return (
                            <button
                                key={idx}
                                onClick={() => onPageChange(pageNumber)}
                                disabled={isLoading}
                                className={`h-8 min-w-[32px] px-2 flex items-center justify-center rounded-md ${
                                    isActive 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-white border border-blue-500 text-blue-500 hover:bg-blue-100'
                                } ${!isVisible ? 'hidden sm:flex' : ''}`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button 
                        onClick={handleNextPage} 
                        disabled={pagination.current_page === pagination.last_page || isLoading}
                        className="rounded-md px-2 py-1 flex items-center justify-center text-blue-500 hover:bg-blue-100 disabled:opacity-50 border border-blue-500"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                <div className="text-sm text-gray-500 text-center sm:text-right">
                    Showing {(pagination.current_page - 1) * pagination.per_page + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} entries
                </div>
            </div>
        </div>
    );
}
