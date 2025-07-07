import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import StageActionDialog from '@/components/stage-action-dialog';

interface Props {
    candidate: {
        id: number;
        user: {
            name: string;
            email: string;
            cv?: {
                path: string | null;
            } | null;
            profile?: {
                full_name: string;
                phone: string;
                address: string;
                birth_place: string;
                birth_date: string;
                gender: string;
            } | null;
        };
        vacancy: {
            title: string;
            company: {
                name: string;
            };
        };
        history?: Array<{
            id: number;
            status: {
                name: string;
                code: string;
            };
            notes: string | null;
            score: number | null;
            processed_at: string;
            scheduled_at: string | null;
            completed_at: string | null;
            reviewer: {
                id: number;
                name: string;
                email: string;
            } | null;
        }>;
        stages: {
            interview: {
                scheduled_at: string | null;
                completed_at: string | null;
                score: number | null;
                notes: string | null;
                interviewer: {
                    name: string;
                    email: string;
                } | null;
            };
        };
        assessment_result?: {
            total_score: number;
            completed_at: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Interview', href: '/dashboard/recruitment/interview' },
    { title: 'Interview Detail', href: '#' },
];

export default function InterviewDetail({ candidate }: Props) {
    const [actionDialog, setActionDialog] = useState<{
        isOpen: boolean;
        action: 'accept' | 'reject';
    } | null>(null);

    const currentHistory = candidate.history?.[0];
    const status = currentHistory?.status;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Interview Detail" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Header with back button */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h2 className="text-2xl font-semibold">{candidate.user.name}</h2>
                            <p className="text-sm text-muted-foreground">
                                Applied for {candidate.vacancy.title} at {candidate.vacancy.company.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {status && (
                            <Badge variant={status.code === 'approved' ? 'secondary' : 
                                        status.code === 'rejected' ? 'destructive' : 'default'}>
                                {status.name}
                            </Badge>
                        )}
                        {candidate.user.cv?.path && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => window.open(candidate.user.cv?.path as string)}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download CV
                            </Button>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => setActionDialog({ isOpen: true, action: 'reject' })}
                    >
                        <ThumbsDown className="h-4 w-4" />
                        Reject
                    </Button>
                    <Button
                        className="gap-2"
                        onClick={() => setActionDialog({ isOpen: true, action: 'accept' })}
                    >
                        <ThumbsUp className="h-4 w-4" />
                        Accept
                    </Button>
                </div>

                {/* Interview Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Interview Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Interview Summary */}
                            <div className="rounded-lg bg-gray-50 p-4">
                                <h3 className="font-medium">Interview Summary</h3>
                                <div className="mt-2 grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-gray-500">Scheduled At</p>
                                        <p className="font-medium">
                                            {candidate.stages.interview.scheduled_at ? 
                                                format(new Date(candidate.stages.interview.scheduled_at), 'dd MMM yyyy HH:mm') : 
                                                '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Completed At</p>
                                        <p className="font-medium">
                                            {candidate.stages.interview.completed_at ? 
                                                format(new Date(candidate.stages.interview.completed_at), 'dd MMM yyyy HH:mm') : 
                                                '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Interviewer</p>
                                        <p className="font-medium">
                                            {candidate.stages.interview.interviewer?.name || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Assessment Score */}
                            {candidate.assessment_result && (
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <h3 className="font-medium">Assessment Result</h3>
                                    <div className="mt-2 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-500">Score</p>
                                            <p className="font-medium">
                                                {Number(candidate.assessment_result.total_score).toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Completed At</p>
                                            <p className="font-medium">
                                                {format(new Date(candidate.assessment_result.completed_at), 'dd MMM yyyy HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Interview Notes */}
                            {candidate.stages.interview.notes && (
                                <div>
                                    <h3 className="mb-2 font-medium">Interview Notes</h3>
                                    <p className="text-gray-700">{candidate.stages.interview.notes}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Stage Action Dialog */}
                {actionDialog && (
                    <StageActionDialog
                        isOpen={actionDialog.isOpen}
                        onClose={() => setActionDialog(null)}
                        applicationId={candidate.id}
                        stage="interview"
                        action={actionDialog.action}
                        title={actionDialog.action === 'accept' ? 'Accept Candidate' : 'Reject Application'}
                        description={
                            actionDialog.action === 'accept'
                                ? 'Please evaluate the candidate and provide a score (10-99). You may add optional notes.'
                                : 'The candidate will be rejected from the recruitment process. Please provide a reason for rejection.'
                        }
                    />
                )}
            </div>
        </AppLayout>
    );
} 