import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, ThumbsUp, ThumbsDown, CheckCircle2, XCircle } from 'lucide-react';
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
            psychological_test: {
                status: string;
                score: number;
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
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Assessment', href: '/dashboard/recruitment/assessment' },
    { title: 'Assessment Detail', href: '#' },
];

export default function AssessmentDetail({ candidate }: Props) {
    const [actionDialog, setActionDialog] = useState<{
        isOpen: boolean;
        action: 'accept' | 'reject';
    } | null>(null);

    const currentHistory = candidate.history?.[0];
    const status = currentHistory?.status;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assessment Detail" />
            
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
                        Pass to Interview
                    </Button>
                </div>

                {/* Assessment Results */}
                <Card>
                    <CardHeader>
                        <CardTitle>Assessment Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Test Summary */}
                            <div className="rounded-lg bg-gray-50 p-4">
                                <h3 className="font-medium">Test Summary</h3>
                                <div className="mt-2 grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-gray-500">Status</p>
                                        <p className="font-medium">{candidate.stages.psychological_test.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Score</p>
                                        <p className="font-medium">{Number(candidate.stages.psychological_test.score).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Duration</p>
                                        <p className="font-medium">
                                            {format(new Date(candidate.stages.psychological_test.started_at), 'HH:mm')} -{' '}
                                            {format(new Date(candidate.stages.psychological_test.completed_at), 'HH:mm')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Answers */}
                            <div>
                                <h3 className="mb-4 font-medium">Answers</h3>
                                <div className="space-y-4">
                                    {candidate.stages.psychological_test.answers.map((answer, index) => (
                                        <div key={index} className="rounded-lg border p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium">Question {index + 1}</p>
                                                    <p className="mt-2">{answer.question.text}</p>
                                                </div>
                                                {answer.selected_answer.is_correct ? (
                                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                                ) : (
                                                    <XCircle className="h-6 w-6 text-red-500" />
                                                )}
                                            </div>
                                            
                                            <div className="mt-4 space-y-2">
                                                {answer.question.choices.map((choice, choiceIndex) => {
                                                    let className = "flex items-center gap-2 rounded-lg p-2 ";
                                                    if (choice.text === answer.selected_answer.text) {
                                                        className += choice.is_correct 
                                                            ? "bg-green-50 text-green-700 font-medium" 
                                                            : "bg-red-50 text-red-700 font-medium";
                                                    } else if (choice.is_correct) {
                                                        className += "bg-green-50 text-green-700";
                                                    }

                                                    return (
                                                        <div key={choiceIndex} className={className}>
                                                            {choice.text === answer.selected_answer.text && (
                                                                <div className={`h-2 w-2 rounded-full ${choice.is_correct ? 'bg-green-500' : 'bg-red-500'}`} />
                                                            )}
                                                            <span>{choice.text}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stage Action Dialog */}
                {actionDialog && (
                    <StageActionDialog
                        isOpen={actionDialog.isOpen}
                        onClose={() => setActionDialog(null)}
                        applicationId={candidate.id}
                        stage="psychological_test"
                        action={actionDialog.action}
                        title={actionDialog.action === 'accept' ? 'Pass to Interview Stage' : 'Reject Application'}
                        description={
                            actionDialog.action === 'accept'
                                ? 'The candidate will proceed to the interview stage. You may add optional notes.'
                                : 'The candidate will be rejected from the recruitment process. Please provide a reason for rejection.'
                        }
                        noScore
                    />
                )}
            </div>
        </AppLayout>
    );
} 