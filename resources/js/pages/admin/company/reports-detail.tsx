import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, ThumbsUp, ThumbsDown, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import StageActionDialog from '@/components/stage-action-dialog';

interface Props {
    candidate: {
        id: number;
        user: {
            id: number;
            name: string;
            email: string;
            profile: {
                full_name: string;
                phone: string;
                address: string;
                birth_place: string;
                birth_date: string;
                gender: string;
            };
            cv?: {
                path: string;
                uploaded_at: string;
            };
        };
        vacancy: {
            title: string;
            company: {
                name: string;
            };
            period: {
                name: string;
                start_time: string;
                end_time: string;
            };
        };
        stages: {
            administration: {
                status: string;
                score: number | null;
                notes: string | null;
                processed_at: string;
                reviewed_by: string;
            };
            assessment: {
                status: string;
                score: number | null;
                started_at: string;
                completed_at: string;
                answers: Array<{
                    question: {
                        text: string;
                        choices: Array<{
                            text: string;
                            is_correct: boolean;
                        }>;
                    };
                    selected_answer: {
                        text: string;
                        is_correct: boolean;
                    };
                }>;
            };
            interview: {
                status: string;
                score: number | null;
                notes: string | null;
                scheduled_at: string;
                completed_at: string;
                interviewer: {
                    name: string;
                    email: string;
                };
            };
        };
        average_score: number | null;
        status: {
            name: string;
            code: string;
        };
        final_decision: {
            status: 'pending' | 'accepted' | 'rejected';
            notes: string | null;
            decided_by: string | null;
            decided_at: string | null;
        };
        history: Array<{
            stage: string;
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
                name: string;
                email: string;
            } | null;
        }>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/dashboard/recruitment/reports' },
    { title: 'Report Detail', href: '#' },
];

export default function ReportDetail({ candidate }: Props) {
    const [actionDialog, setActionDialog] = useState<{
        isOpen: boolean;
        action: 'accept' | 'reject';
    } | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report Detail" />
            
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
                        <Badge variant={
                            candidate.final_decision.status === 'accepted' ? 'default' :
                            candidate.final_decision.status === 'rejected' ? 'destructive' : 
                            'secondary'
                        }>
                            {candidate.final_decision.status === 'accepted' ? 'Accepted' :
                             candidate.final_decision.status === 'rejected' ? 'Rejected' :
                             'Pending Decision'}
                        </Badge>
                        {candidate.final_decision.decided_at && (
                            <span className="text-sm text-muted-foreground">
                                Decided on {format(new Date(candidate.final_decision.decided_at), 'dd MMM yyyy')}
                                {candidate.final_decision.decided_by && ` by ${candidate.final_decision.decided_by}`}
                            </span>
                        )}
                        {candidate.user.cv && (
                            <Button variant="outline" size="sm" onClick={() => window.open(candidate.user.cv?.path)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download CV
                            </Button>
                        )}
                    </div>
                </div>

                {/* Action Buttons - Only show if status is pending */}
                {candidate.final_decision.status === 'pending' && (
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
                )}

                {/* Final Decision Summary - Show if decided */}
                {candidate.final_decision.status !== 'pending' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {candidate.final_decision.status === 'accepted' ? (
                                    <>
                                        <ThumbsUp className="h-5 w-5 text-green-600" />
                                        Candidate Accepted
                                    </>
                                ) : (
                                    <>
                                        <ThumbsDown className="h-5 w-5 text-red-600" />
                                        Candidate Rejected
                                    </>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div>
                                    <p className="font-medium">Decision Made By:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.final_decision.decided_by || 'Unknown'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Decision Date:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.final_decision.decided_at 
                                            ? format(new Date(candidate.final_decision.decided_at), 'dd MMM yyyy HH:mm')
                                            : 'Unknown'}
                                    </p>
                                </div>
                                {candidate.final_decision.notes && (
                                    <div>
                                        <p className="font-medium">Notes:</p>
                                        <p className="text-sm text-muted-foreground">
                                            {candidate.final_decision.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Overall Score */}
                <Card>
                    <CardHeader>
                        <CardTitle>Overall Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Administration</p>
                                <p className="text-2xl font-semibold">
                                    {candidate.stages.administration.score?.toFixed(2) || '-'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Assessment</p>
                                <p className="text-2xl font-semibold">
                                    {candidate.stages.assessment.score?.toFixed(2) || '-'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Interview</p>
                                <p className="text-2xl font-semibold">
                                    {candidate.stages.interview.score?.toFixed(2) || '-'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Average</p>
                                <p className="text-2xl font-semibold">
                                    {candidate.average_score?.toFixed(2) || '-'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Administration Stage */}
                <Card>
                    <CardHeader>
                        <CardTitle>Administration Stage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Status</p>
                                    <p className="text-sm text-muted-foreground">{candidate.stages.administration.status}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Score</p>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.stages.administration.score?.toFixed(2) || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Reviewed By</p>
                                    <p className="text-sm text-muted-foreground">{candidate.stages.administration.reviewed_by}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Processed At</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(candidate.stages.administration.processed_at), 'dd MMM yyyy HH:mm')}
                                    </p>
                                </div>
                            </div>
                            {candidate.stages.administration.notes && (
                                <div>
                                    <p className="font-medium">Notes</p>
                                    <p className="text-sm text-muted-foreground">{candidate.stages.administration.notes}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Assessment Stage */}
                <Card>
                    <CardHeader>
                        <CardTitle>Assessment Stage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Status</p>
                                    <p className="text-sm text-muted-foreground">{candidate.stages.assessment.status}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Score</p>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.stages.assessment.score?.toFixed(2) || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Started At</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(candidate.stages.assessment.started_at), 'dd MMM yyyy HH:mm')}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Completed At</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(candidate.stages.assessment.completed_at), 'dd MMM yyyy HH:mm')}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 font-medium">Test Answers</h3>
                                <div className="space-y-4">
                                    {candidate.stages.assessment.answers.map((answer, index) => (
                                        <div key={index} className="rounded-lg border p-4">
                                            <div className="mb-2 flex items-start justify-between">
                                                <p className="font-medium">{answer.question.text}</p>
                                                {answer.selected_answer.is_correct ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-500" />
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                {answer.question.choices.map((choice, choiceIndex) => (
                                                    <div
                                                        key={choiceIndex}
                                                        className={`rounded-md p-2 ${
                                                            choice.text === answer.selected_answer.text
                                                                ? choice.is_correct
                                                                    ? 'bg-green-50 text-green-700'
                                                                    : 'bg-red-50 text-red-700'
                                                                : choice.is_correct
                                                                ? 'bg-green-50 text-green-700'
                                                                : ''
                                                        }`}
                                                    >
                                                        {choice.text}
                                                        {choice.text === answer.selected_answer.text && ' (Selected)'}
                                                        {choice.is_correct && ' (Correct)'}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Interview Stage */}
                <Card>
                    <CardHeader>
                        <CardTitle>Interview Stage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Status</p>
                                    <p className="text-sm text-muted-foreground">{candidate.stages.interview.status}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Score</p>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.stages.interview.score?.toFixed(2) || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Interviewer</p>
                                    <p className="text-sm text-muted-foreground">{candidate.stages.interview.interviewer.name}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Scheduled At</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(candidate.stages.interview.scheduled_at), 'dd MMM yyyy HH:mm')}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Completed At</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(candidate.stages.interview.completed_at), 'dd MMM yyyy HH:mm')}
                                    </p>
                                </div>
                            </div>
                            {candidate.stages.interview.notes && (
                                <div>
                                    <p className="font-medium">Interview Notes</p>
                                    <p className="text-sm text-muted-foreground">{candidate.stages.interview.notes}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* History Timeline */}
                <Card>
                    <CardHeader>
                        <CardTitle>Application History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {candidate.history.map((record, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">{record.stage}</h4>
                                            <p className="text-sm text-muted-foreground">{record.status.name}</p>
                                        </div>
                                        <Badge variant={
                                            record.status.code === 'approved' ? 'secondary' :
                                            record.status.code === 'rejected' ? 'destructive' :
                                            'default'
                                        }>
                                            {record.status.code}
                                        </Badge>
                                    </div>
                                    {record.reviewer && (
                                        <p className="text-sm text-muted-foreground">
                                            Reviewed by {record.reviewer.name}
                                        </p>
                                    )}
                                    {record.notes && (
                                        <p className="text-sm">{record.notes}</p>
                                    )}
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        {record.processed_at && (
                                            <span>Processed: {format(new Date(record.processed_at), 'dd MMM yyyy HH:mm')}</span>
                                        )}
                                        {record.scheduled_at && (
                                            <span>Scheduled: {format(new Date(record.scheduled_at), 'dd MMM yyyy HH:mm')}</span>
                                        )}
                                        {record.completed_at && (
                                            <span>Completed: {format(new Date(record.completed_at), 'dd MMM yyyy HH:mm')}</span>
                                        )}
                                        {record.score && (
                                            <span>Score: {record.score.toFixed(2)}</span>
                                        )}
                                    </div>
                                    {index < candidate.history.length - 1 && (
                                        <Separator className="my-4" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Stage Action Dialog */}
                {actionDialog && (
                    <StageActionDialog
                        isOpen={actionDialog.isOpen}
                        onClose={() => setActionDialog(null)}
                        applicationId={candidate.id}
                        stage="final"
                        action={actionDialog.action}
                        title={actionDialog.action === 'accept' ? 'Accept Candidate' : 'Reject Application'}
                        description={
                            actionDialog.action === 'accept'
                                ? 'Are you sure you want to accept this candidate? This will mark them as hired.'
                                : 'The candidate will be rejected from the recruitment process. Please provide a reason for rejection.'
                        }
                    />
                )}
            </div>
        </AppLayout>
    );
} 