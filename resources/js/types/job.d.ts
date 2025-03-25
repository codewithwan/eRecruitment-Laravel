export interface Job {
    id: number;
    title: string;
    department: string;
    location: string;
    requirements: string[];
    benefits?: string[] | null;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface JobTableProps {
    jobs: Job[];
    onView: (jobId: number) => void;
    onEdit: (jobId: number) => void;
    onDelete: (jobId: number) => void;
}
