import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CandidateProfile {
    id: number;
    user_id: number;
    phone: string;
    address: string;
    birth_date: string;
    birth_place: string;
    gender: 'male' | 'female';
    religion: string;
    marital_status: string;
    nationality: string;
}

interface Candidate {
    id: string;
    name: string;
    email: string;
    position: string;
    company: string;
    status: string;
    score?: number;
    scheduled_at?: string;
    completed_at?: string;
    notes?: string;
    reviewed_by?: string;
    candidate?: {
        profile: CandidateProfile;
        education: Array<{
            level: string;
            institution: string;
            major: string;
            start_year: number;
            end_year: number;
            gpa: number;
        }>;
        skills: string[];
        languages: Array<{
            name: string;
            level: string;
        }>;
        certifications: Array<{
            name: string;
            issuer: string;
            date: string;
        }>;
        work_experiences: Array<{
            company: string;
            position: string;
            start_date: string;
            end_date: string;
            description: string;
        }>;
        organizations: Array<{
            name: string;
            position: string;
            start_year: number;
            end_year: number;
        }>;
        cv?: string;
    };
}

interface RecruitmentStageTableProps {
    candidates: Candidate[];
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        data: Candidate[];
    };
    stage: string;
    onView: (id: string) => void;
    onStatusUpdate: (id: string, status: string, data?: {
        score?: number;
        notes?: string;
        scheduled_at?: string;
    }) => void;
    onPageChange: (page: number) => void;
}

export function RecruitmentStageTable({
    candidates,
    pagination,
    stage,
    onView,
    onStatusUpdate,
    onPageChange,
}: RecruitmentStageTableProps) {
    const getStatusBadgeColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'passed':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleStatusUpdate = (candidate: Candidate, newStatus: string) => {
        onStatusUpdate(candidate.id, newStatus, {
            score: candidate.score,
            notes: candidate.notes,
            scheduled_at: candidate.scheduled_at
        });
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Status</TableHead>
                            {stage === 'psychological_test' && <TableHead>Score</TableHead>}
                            {stage === 'interview' && <TableHead>Schedule</TableHead>}
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {candidates.map((candidate) => (
                            <TableRow key={candidate.id}>
                                <TableCell className="font-medium">{candidate.name}</TableCell>
                                <TableCell>{candidate.position}</TableCell>
                                <TableCell>
                                    <Badge 
                                        variant="outline" 
                                        className={getStatusBadgeColor(candidate.status)}
                                        onClick={() => handleStatusUpdate(candidate, candidate.status === 'pending' ? 'passed' : 'pending')}
                                    >
                                        {candidate.status}
                                    </Badge>
                                </TableCell>
                                {stage === 'psychological_test' && (
                                    <TableCell>
                                        {candidate.score ?? 'Not available'}
                                    </TableCell>
                                )}
                                {stage === 'interview' && (
                                    <TableCell>
                                        {candidate.scheduled_at ? (
                                            <div className="text-sm">
                                                <div>{formatDate(candidate.scheduled_at)}</div>
                                            </div>
                                        ) : (
                                            'Not scheduled'
                                        )}
                                    </TableCell>
                                )}
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onView(candidate.id)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Showing page {pagination.current_page} of {Math.ceil(pagination.total / pagination.per_page)}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === Math.ceil(pagination.total / pagination.per_page)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
} 