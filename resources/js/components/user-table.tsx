import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, EyeIcon, Pencil, Trash2 } from 'lucide-react';

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
        <>
            <Table className="table-fixed">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[8%]">ID</TableHead>
                        <TableHead className="w-[20%]">Name</TableHead>
                        <TableHead className="w-[22%]">Email</TableHead>
                        <TableHead className="w-[10%]">Role</TableHead>
                        <TableHead className="w-[10%]">Verified</TableHead>
                        <TableHead className="w-[15%]">Registration Date</TableHead>
                        <TableHead className="w-[15%] pr-10 text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        // Skeleton loading rows
                        Array(pagination.per_page)
                            .fill(0)
                            .map((_, idx) => (
                                <TableRow key={`skeleton-${idx}`}>
                                    <TableCell className="w-[8%]">
                                        <Skeleton className="h-4 w-8" />
                                    </TableCell>
                                    <TableCell className="w-[20%]">
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                    <TableCell className="w-[22%]">
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                    <TableCell className="w-[10%]">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </TableCell>
                                    <TableCell className="w-[10%]">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </TableCell>
                                    <TableCell className="w-[15%]">
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell className="w-[15%] space-x-2 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                    ) : users.length > 0 ? (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="w-[8%]">{user.id}</TableCell>
                                <TableCell className="w-[20%] font-medium">{user.name}</TableCell>
                                <TableCell className="w-[22%]">{user.email}</TableCell>
                                <TableCell className="w-[10%]">
                                    <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>{user.role}</Badge>
                                </TableCell>
                                <TableCell className="w-[10%]">
                                    {user.email_verified_at ? <Badge variant="default">Verified</Badge> : <Badge variant="secondary">Pending</Badge>}
                                </TableCell>
                                <TableCell className="w-[15%]">{user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : '-'}</TableCell>
                                <TableCell className="w-[15%] space-x-2 text-right">
                                    <Button variant="ghost" size="icon" onClick={() => onView(user.id)}>
                                        <EyeIcon className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(user.id)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(user.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
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

            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Show</span>
                    <Select value={pagination.per_page.toString()} onValueChange={handleItemsPerPageChange} disabled={isLoading}>
                        <SelectTrigger className="w-20">
                            <SelectValue placeholder={pagination.per_page.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                            {itemsPerPageOptions.map((option) => (
                                <SelectItem key={option} value={option.toString()}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-500">per page</span>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={pagination.current_page === 1 || isLoading}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Enhanced Page numbers */}
                    <div className="flex items-center">
                        {pagination.last_page > 7 && pagination.current_page > 3 && (
                            <>
                                <Button variant="outline" size="sm" className="mx-0.5 h-8 w-8" onClick={() => onPageChange(1)} disabled={isLoading}>
                                    1
                                </Button>
                                {pagination.current_page > 4 && <span className="mx-1">...</span>}
                            </>
                        )}

                        {/* Page number buttons */}
                        {[...Array(pagination.last_page)].map((_, idx) => {
                            const pageNumber = idx + 1;

                            // Only show pages nearby current page for many pages
                            if (
                                pagination.last_page <= 7 ||
                                (pageNumber >= pagination.current_page - 2 && pageNumber <= pagination.current_page + 2)
                            ) {
                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={pageNumber === pagination.current_page ? 'default' : 'outline'}
                                        size="sm"
                                        className="mx-0.5 h-8 w-8"
                                        onClick={() => onPageChange(pageNumber)}
                                        disabled={isLoading}
                                    >
                                        {pageNumber}
                                    </Button>
                                );
                            }
                            return null;
                        })}

                        {pagination.last_page > 7 && pagination.current_page < pagination.last_page - 2 && (
                            <>
                                {pagination.current_page < pagination.last_page - 3 && <span className="mx-1">...</span>}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mx-0.5 h-8 w-8"
                                    onClick={() => onPageChange(pagination.last_page)}
                                    disabled={isLoading}
                                >
                                    {pagination.last_page}
                                </Button>
                            </>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={pagination.current_page === pagination.last_page || isLoading}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="text-sm text-gray-500">
                    {pagination.total > 0 ? (
                        <>
                            Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{' '}
                            {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} entries
                        </>
                    ) : (
                        'No entries'
                    )}
                </div>
            </div>
        </>
    );
}
