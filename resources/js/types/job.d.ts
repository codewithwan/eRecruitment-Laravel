export interface Job {
    id: number;
    title: string;
    department_id?: number;
    major_id?: number;
    location: string;
    salary?: string;
    company_id?: number;
    education_level_id?: number;
    question_pack_id?: number;
    requirements: string[];
    benefits?: string[] | null;
    user_id: number;
    created_at: string;
    updated_at: string;
    status?: string;
    company?: {
        id: number;
        name: string;
    };
    departement?: {
        id: number;
        name: string;
    };
    major?: {
        id: number;
        name: string;
        description?: string;
    };
    educationLevel?: {
        id: number;
        name: string;
    };
    questionPack?: {
        id: number;
        pack_name: string;
        description?: string;
        test_type?: string;
        duration?: number;
    };
}

export interface JobTableProps {
    jobs: Job[];
    onView: (jobId: number) => void;
    onEdit: (jobId: number) => void;
    onDelete: (jobId: number) => void;
}
