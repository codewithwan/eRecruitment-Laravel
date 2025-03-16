import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye, Trash } from 'lucide-react';
import { format } from 'date-fns';

// User interface definition
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}

interface UserTableProps {
    users: User[];
    onView?: (userId: number) => void;
    onEdit?: (userId: number) => void;
    onDelete?: (userId: number) => void;
}

export function UserTable({ 
    users, 
    onView = (id) => console.log('View user:', id),
    onEdit = (id) => console.log('Edit user:', id),
    onDelete = (id) => console.log('Delete user:', id)
}: UserTableProps) {
    return (
        <>
            {Array.isArray(users) && users.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Verified</TableHead>
                            <TableHead>Registration Date</TableHead>
                            <TableHead className="text-right pr-10">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === "admin" ? "destructive" : "default"}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {user.email_verified_at ? (
                                        <Badge variant="default">Verified</Badge>
                                    ) : (
                                        <Badge variant="secondary">Pending</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : '-'}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon" onClick={() => onView(user.id)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(user.id)}>
                                        <Edit className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(user.id)}>
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-center py-4">No users found.</p>
            )}
        </>
    );
}
