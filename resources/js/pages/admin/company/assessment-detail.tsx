import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, FileText } from 'lucide-react';
import { useState } from 'react';
import { InterviewScheduleModal } from '@/components/interview-schedule-modal';

interface AssessmentQuestion {
    id: string;
    question: string;
    answer: string;
    score: number;
    maxScore: number;
    category: string;
}

interface AssessmentDetailData {
    id: string;
    name: string;
    email: string;
    phone?: string;
    position: string;
    vacancy: string;
    company_id?: number;
    period_id?: number;
    registration_date: string;
    assessment_date?: string;
    cv_path?: string;
    portfolio_path?: string;
    cover_letter?: string;
    status: 'pending' | 'completed' | 'approved' | 'rejected' | 'assessment';
    total_score: number;
    max_total_score: number;
    questions: AssessmentQuestion[];
    notes?: string;
}

interface AssessmentDetailProps {
    assessment: AssessmentDetailData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Assessment Management',
        href: '/dashboard/assessment',
    },
    {
        title: 'Assessment Detail',
        href: '#',
    },
];

export default function AssessmentDetail({ assessment }: AssessmentDetailProps) {
    const backUrl = assessment.company_id && assessment.period_id
        ? `/dashboard/company/assessment?company=${assessment.company_id}&period=${assessment.period_id}`
        : '/dashboard/company/assessment';

    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hrNotes, setHrNotes] = useState('');
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewLink, setInterviewLink] = useState('');
    const [interviewNote, setInterviewNote] = useState('');

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            router.post(`/dashboard/assessment/${assessment.id}/approve`, {
                hr_notes: hrNotes
            }, {
                onSuccess: () => {
                    console.log('Candidate approved and moved to interview stage');
                },
                onError: (errors) => {
                    console.error('Error approving candidate:', errors);
                },
                onFinish: () => {
                    setIsLoading(false);
                    setIsApproveDialogOpen(false);
                }
            });
        } catch (error) {
            console.error('Error approving candidate:', error);
            setIsLoading(false);
            setIsApproveDialogOpen(false);
        }
    };

    const handleReject = async () => {
        setIsLoading(true);
        try {
            router.post(`/dashboard/assessment/${assessment.id}/reject`, {
                hr_notes: hrNotes
            }, {
                onSuccess: () => {
                    console.log('Candidate rejected');
                },
                onError: (errors) => {
                    console.error('Error rejecting candidate:', errors);
                },
                onFinish: () => {
                    setIsLoading(false);
                    setIsRejectDialogOpen(false);
                }
            });
        } catch (error) {
            console.error('Error rejecting candidate:', error);
            setIsLoading(false);
            setIsRejectDialogOpen(false);
        }
    };

    const handleSubmitApprove = (e: React.FormEvent) => {
        e.preventDefault();
        // Lakukan aksi simpan interviewDate, interviewLink, interviewNote
        setIsApproveModalOpen(false);
    };

    const getScoreColor = (score: number, maxScore: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 80) return 'text-emerald-600';
        if (percentage >= 60) return 'text-amber-600';
        return 'text-red-500';
    };

    const getScoreLevel = (score: number, maxScore: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return { level: 'Excellent', color: 'bg-emerald-500' };
        if (percentage >= 80) return { level: 'Very Good', color: 'bg-emerald-400' };
        if (percentage >= 70) return { level: 'Good', color: 'bg-blue-500' };
        if (percentage >= 60) return { level: 'Average', color: 'bg-amber-500' };
        return { level: 'Below Average', color: 'bg-red-500' };
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { bg: string, text: string }> = {
            pending: { bg: 'bg-amber-100', text: 'text-amber-700' },
            completed: { bg: 'bg-blue-100', text: 'text-blue-700' },
            approved: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
            rejected: { bg: 'bg-red-100', text: 'text-red-700' }
        };
        
        const variant = variants[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
        
        return (
            <Badge className={`${variant.bg} ${variant.text} border-0`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const totalPercentage = Math.round((assessment.total_score / assessment.max_total_score) * 100);
    const scoreLevel = getScoreLevel(assessment.total_score, assessment.max_total_score);

    // Calculate category averages
    const categoryScores = assessment.questions.reduce((acc, question) => {
        if (!acc[question.category]) {
            acc[question.category] = { total: 0, max: 0, count: 0 };
        }
        acc[question.category].total += question.score;
        acc[question.category].max += question.maxScore;
        acc[question.category].count += 1;
        return acc;
    }, {} as Record<string, { total: number, max: number, count: number }>);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Assessment Detail - ${assessment.name}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.visit(backUrl)}
                                className="shrink-0 hover:bg-gray-100"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <h2 className="text-2xl font-semibold">Assessment Detail</h2>
                        </div>
                    </div>

                    {/* Candidate Header Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">{assessment.name}</CardTitle>
                                    <CardDescription className="mt-1">
                                        {assessment.position} • {assessment.vacancy}
                                    </CardDescription>
                                </div>
                                {getStatusBadge(assessment.status)}
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Score Overview Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Assessment Score</CardTitle>
                            <CardDescription>Overall performance and evaluation results</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-4xl font-bold ${getScoreColor(assessment.total_score, assessment.max_total_score)}`}>
                                            {totalPercentage}%
                                        </span>
                                        <span className="text-gray-500">
                                            ({assessment.total_score}/{assessment.max_total_score})
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{scoreLevel.level}</p>
                                </div>
                                <div className="w-24 h-24">
                                    <div className="relative w-full h-full">
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                            <path
                                                d="M18 2.0845
                                                a 15.9155 15.9155 0 0 1 0 31.831
                                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke="#f1f5f9"
                                                strokeWidth="2"
                                            />
                                            <path
                                                d="M18 2.0845
                                                a 15.9155 15.9155 0 0 1 0 31.831
                                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                                fill="none"
                                                stroke={totalPercentage >= 80 ? "#10b981" : totalPercentage >= 60 ? "#f59e0b" : "#ef4444"}
                                                strokeWidth="2"
                                                strokeDasharray={`${totalPercentage}, 100`}
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Candidate Information Card */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Candidate Information</CardTitle>
                                    <CardDescription>Personal details and documents</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-gray-500 font-medium">Email</p>
                                            <p className="text-gray-900">{assessment.email}</p>
                                        </div>
                                        
                                        {assessment.phone && (
                                            <div>
                                                <p className="text-gray-500 font-medium">Phone</p>
                                                <p className="text-gray-900">{assessment.phone}</p>
                                            </div>
                                        )}
                                        
                                        <div>
                                            <p className="text-gray-500 font-medium">Applied Date</p>
                                            <p className="text-gray-900">
                                                {new Date(assessment.registration_date).toLocaleDateString('en-US', { 
                                                    month: 'long', 
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        
                                        {assessment.assessment_date && (
                                            <div>
                                                <p className="text-gray-500 font-medium">Assessment Date</p>
                                                <p className="text-gray-900">
                                                    {new Date(assessment.assessment_date).toLocaleDateString('en-US', { 
                                                        month: 'long', 
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Documents */}
                                    {(assessment.cv_path || assessment.portfolio_path) && (
                                        <>
                                            <Separator />
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-gray-900">Documents</p>
                                                {assessment.cv_path && (
                                                    <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-gray-600 hover:text-gray-900">
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        Resume
                                                    </Button>
                                                )}
                                                {assessment.portfolio_path && (
                                                    <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-gray-600 hover:text-gray-900">
                                                        <FileText className="h-4 w-4 mr-2" />
                                                        Portfolio
                                                    </Button>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Cover Letter */}
                                    {assessment.cover_letter && (
                                        <>
                                            <Separator />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 mb-2">Cover Letter</p>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {assessment.cover_letter}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Assessment Results */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Assessment Results Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Assessment Results</CardTitle>
                                    <CardDescription>Detailed answers and scores for each question</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {assessment.questions.map((question, index) => {
                                            const percentage = Math.round((question.score / question.maxScore) * 100);
                                            return (
                                                <div key={question.id} className="pb-6 border-b border-gray-200 last:border-b-0">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                                                                    {question.category}
                                                                </Badge>
                                                                <span className={`text-sm font-medium ${getScoreColor(question.score, question.maxScore)}`}>
                                                                    {question.score}/{question.maxScore}
                                                                </span>
                                                            </div>
                                                            <h4 className="font-medium text-gray-900 mb-3 leading-relaxed">
                                                                {question.question}
                                                            </h4>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-gray-50 p-4 rounded-lg">
                                                        <p className="text-sm text-gray-700 leading-relaxed">
                                                            {question.answer}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {assessment.notes && (
                                        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                                            <p className="text-sm font-medium text-amber-800 mb-1">Assessment Notes</p>
                                            <p className="text-sm text-amber-700">
                                                {assessment.notes}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* HR Review Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>HR Review</CardTitle>
                                    <CardDescription>Add your evaluation notes and feedback</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Textarea
                                        id="assessment-notes"
                                        placeholder="Add your review notes..."
                                        value={hrNotes}
                                        onChange={(e) => setHrNotes(e.target.value)}
                                        className="min-h-[100px] border-gray-200 focus:border-gray-300 focus:ring-0"
                                    />
                                    {assessment.status === 'completed' && (
                                        <div className="flex justify-end gap-3 mt-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsRejectDialogOpen(true)}
                                                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                onClick={() => setIsInterviewModalOpen(true)}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                            >
                                                Approve for Interview
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approve Dialog */}
            <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-medium">
                            Approve Candidate
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                            You are about to approve <strong>{assessment.name}</strong> for the interview stage.
                            This candidate will be moved to the interview process.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleApprove}
                            disabled={isLoading}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {isLoading ? 'Approving...' : 'Approve'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Dialog */}
            <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-medium">
                            Reject Candidate
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                            You are about to reject <strong>{assessment.name}</strong> from the recruitment process.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleReject}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isLoading ? 'Rejecting...' : 'Reject'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Interview Schedule Dialog */}
            <Dialog open={isInterviewModalOpen} onOpenChange={setIsInterviewModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Set Interview Schedule</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            setIsInterviewModalOpen(false);
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium mb-1">Interview Date</label>
                            <Input
                                type="datetime-local"
                                value={interviewDate}
                                onChange={e => setInterviewDate(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Interview Link</label>
                            <Input
                                type="url"
                                placeholder="https://meet.example.com/..."
                                value={interviewLink}
                                onChange={e => setInterviewLink(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Note</label>
                            <Textarea
                                placeholder="Add interview notes (optional)..."
                                value={hrNotes}
                                onChange={e => setHrNotes(e.target.value)}
                                className="min-h-[80px] border-gray-200 focus:border-gray-300 focus:ring-0"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsInterviewModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save & Approve</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Approve Modal */}
            <InterviewScheduleModal
                open={isApproveModalOpen}
                onOpenChange={setIsApproveModalOpen}
                interviewDate={interviewDate}
                setInterviewDate={setInterviewDate}
                interviewLink={interviewLink}
                setInterviewLink={setInterviewLink}
                interviewNote={interviewNote}
                setInterviewNote={setInterviewNote}
                onSubmit={handleSubmitApprove}
                isLoading={isLoading}
            />
        </AppLayout>
    );
}