// User interface definition
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}

export interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

export interface UserTableProps {
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
