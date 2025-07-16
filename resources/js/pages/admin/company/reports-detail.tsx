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
                                Download Resume
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
                                    {candidate.stages.administration.score ? Number(candidate.stages.administration.score).toFixed(1) : '-'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Assessment</p>
                                <p className="text-2xl font-semibold">
                                    {candidate.stages.assessment.score ? Number(candidate.stages.assessment.score).toFixed(1) : '-'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Interview</p>
                                <p className="text-2xl font-semibold">
                                    {candidate.stages.interview.score ? Number(candidate.stages.interview.score).toFixed(1) : '-'}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Average</p>
                                <p className="text-2xl font-semibold">
                                    {candidate.average_score ? Number(candidate.average_score).toFixed(1) : '-'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Candidate Profile */}
                <Card>
                    <CardHeader>
                        <CardTitle>Candidate Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="font-medium">Full Name</p>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.user.profile?.full_name || candidate.user.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">{candidate.user.email}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Phone</p>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.user.profile?.phone || '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-medium">Gender</p>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.user.profile?.gender || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Birth Date</p>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.user.profile?.birth_date 
                                            ? format(new Date(candidate.user.profile.birth_date), 'dd MMM yyyy')
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">Address</p>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.user.profile?.address || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recruitment Process Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recruitment Process Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Administration */}
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">1</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Administration Review</h3>
                                        <p className="text-sm text-muted-foreground">Document verification & initial screening</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">
                                        {candidate.stages.administration.score ? Number(candidate.stages.administration.score).toFixed(1) : 'Not scored'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.stages.administration.processed_at 
                                            ? format(new Date(candidate.stages.administration.processed_at), 'dd MMM yyyy')
                                            : 'Pending'}
                                    </p>
                                </div>
                            </div>

                            {/* Assessment */}
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <span className="text-green-600 font-semibold">2</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Assessment Test</h3>
                                        <p className="text-sm text-muted-foreground">Online technical/psychological test</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">
                                        {candidate.stages.assessment.score ? Number(candidate.stages.assessment.score).toFixed(1) : 'Not completed'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.stages.assessment.completed_at 
                                            ? format(new Date(candidate.stages.assessment.completed_at), 'dd MMM yyyy')
                                            : candidate.stages.assessment.started_at 
                                                ? 'In progress'
                                                : 'Not started'}
                                    </p>
                                </div>
                            </div>

                            {/* Interview */}
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                        <span className="text-orange-600 font-semibold">3</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Interview</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {candidate.stages.interview.interviewer ? 
                                                `with ${candidate.stages.interview.interviewer.name}` : 
                                                'Final interview session'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">
                                        {candidate.stages.interview.score ? Number(candidate.stages.interview.score).toFixed(1) : 'Not completed'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {candidate.stages.interview.completed_at 
                                            ? format(new Date(candidate.stages.interview.completed_at), 'dd MMM yyyy')
                                            : candidate.stages.interview.scheduled_at 
                                                ? `Scheduled for ${format(new Date(candidate.stages.interview.scheduled_at), 'dd MMM yyyy')}`
                                                : 'Not scheduled'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Key Notes & Comments */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notes & Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Administration Notes */}
                            {candidate.stages.administration.notes && (
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-medium text-blue-900">Administration Review</h4>
                                    <p className="text-sm text-blue-700 mt-1">{candidate.stages.administration.notes}</p>
                                    <p className="text-xs text-blue-600 mt-2">
                                        By {candidate.stages.administration.reviewed_by}
                                    </p>
                                </div>
                            )}
                            
                            {/* Interview Notes */}
                            {candidate.stages.interview.notes && (
                                <div className="p-4 bg-orange-50 rounded-lg">
                                    <h4 className="font-medium text-orange-900">Interview Feedback</h4>
                                    <p className="text-sm text-orange-700 mt-1">{candidate.stages.interview.notes}</p>
                                    <p className="text-xs text-orange-600 mt-2">
                                        By {candidate.stages.interview.interviewer?.name || 'Interviewer'}
                                    </p>
                                </div>
                            )}

                            {/* Final Decision Notes */}
                            {candidate.final_decision.notes && (
                                <div className={`p-4 rounded-lg ${
                                    candidate.final_decision.status === 'accepted' 
                                        ? 'bg-green-50' 
                                        : candidate.final_decision.status === 'rejected' 
                                            ? 'bg-red-50' 
                                            : 'bg-gray-50'
                                }`}>
                                    <h4 className={`font-medium ${
                                        candidate.final_decision.status === 'accepted' 
                                            ? 'text-green-900' 
                                            : candidate.final_decision.status === 'rejected' 
                                                ? 'text-red-900' 
                                                : 'text-gray-900'
                                    }`}>
                                        Final Decision
                                    </h4>
                                    <p className={`text-sm mt-1 ${
                                        candidate.final_decision.status === 'accepted' 
                                            ? 'text-green-700' 
                                            : candidate.final_decision.status === 'rejected' 
                                                ? 'text-red-700' 
                                                : 'text-gray-700'
                                    }`}>
                                        {candidate.final_decision.notes}
                                    </p>
                                    {candidate.final_decision.decided_by && (
                                        <p className={`text-xs mt-2 ${
                                            candidate.final_decision.status === 'accepted' 
                                                ? 'text-green-600' 
                                                : candidate.final_decision.status === 'rejected' 
                                                    ? 'text-red-600' 
                                                    : 'text-gray-600'
                                        }`}>
                                            By {candidate.final_decision.decided_by}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Show message if no notes available */}
                            {!candidate.stages.administration.notes && 
                             !candidate.stages.interview.notes && 
                             !candidate.final_decision.notes && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No additional notes or comments available</p>
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