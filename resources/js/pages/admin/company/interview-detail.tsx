import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowLeft, Briefcase, Calendar, CheckCircle, Clock, FileText, Mail, User, XCircle } from 'lucide-react';
import { useState } from 'react';

interface InterviewDetailProps {
    userId: string;
    interviewData: InterviewData;
}

interface InterviewData {
    id: string;
    name: string;
    email: string;
    position: string;
    registration_date: string;
    phone?: string;
    cv_url?: string;
    interview_date?: string;
    interview_time?: string;
    status: 'pending' | 'approved' | 'rejected' | 'interview';
    notes?: string;
    notes_1?: string;
    skills: string[];
    experience_years: number;
    education: string;
    portfolio_url?: string;
    score?: string;
    company_id?: number;
    period_id?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Interview',
        href: '/dashboard/company/interview',
    },
    {
        title: 'Interview Detail',
        href: '#',
    },
];

export default function InterviewDetail({ userId, interviewData }: InterviewDetailProps) {
    const backUrl = interviewData.company_id && interviewData.period_id
        ? `/dashboard/company/interview?company=${interviewData.company_id}&period=${interviewData.period_id}`
        : '/dashboard/company/interview';

    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [localInterviewData, setLocalInterviewData] = useState<InterviewData>(interviewData);

    const handleApprove = () => {
        setIsApproveDialogOpen(true);
    };

    const handleReject = () => {
        setIsRejectDialogOpen(true);
    };

    const confirmApprove = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            console.log('Approving candidate:', userId);
            // Navigate to reports page after approval
            router.visit('/dashboard/company/reports');
        }, 1000);
    };

    const confirmReject = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            console.log('Rejecting candidate:', userId);
            // Navigate back to interview list
            router.visit('/dashboard/company/interview');
        }, 1000);
    };

    const handleBack = () => {
        router.visit(backUrl);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Interview - ${localInterviewData.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={handleBack}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Interview Details</h1>
                            <p className="text-sm text-gray-500">Review candidate information and make a decision</p>
                        </div>
                    </div>
                    {getStatusBadge(localInterviewData.status)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Candidate Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Candidate Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                                        <p className="text-base font-medium text-gray-900">{localInterviewData.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <p className="text-base text-gray-900">{localInterviewData.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Phone</label>
                                        <p className="text-base text-gray-900">{localInterviewData.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Applied Position</label>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-gray-400" />
                                            <p className="text-base font-medium text-gray-900">{localInterviewData.position}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Registration Date</label>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <p className="text-base text-gray-900">
                                                {format(new Date(localInterviewData.registration_date), 'MMMM dd, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Experience</label>
                                        <p className="text-base text-gray-900">{localInterviewData.experience_years} years</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills & Education */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Skills & Education</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 mb-2 block">Technical Skills</label>
                                    <div className="flex flex-wrap gap-2">
                                        {localInterviewData.skills.map((skill, index) => (
                                            <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Education</label>
                                    <p className="text-base text-gray-900">{localInterviewData.education}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interview Notes */}
                        {localInterviewData.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Interview Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed">{localInterviewData.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Interview Schedule */}
                        {localInterviewData.interview_date && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Interview Schedule
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Date</label>
                                        <p className="text-base text-gray-900">
                                            {format(new Date(localInterviewData.interview_date), 'EEEE, MMMM dd, yyyy')}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Time</label>
                                        <p className="text-base text-gray-900">{localInterviewData.interview_time} WIB</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Documents */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Documents</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {localInterviewData.cv_url && (
                                    <div>
                                        <Button variant="outline" className="w-full justify-start" asChild>
                                            <a href={localInterviewData.cv_url} target="_blank" rel="noopener noreferrer">
                                                <FileText className="h-4 w-4 mr-2" />
                                                View CV/Resume
                                            </a>
                                        </Button>
                                    </div>
                                )}
                                {localInterviewData.portfolio_url && (
                                    <div>
                                        <Button variant="outline" className="w-full justify-start" asChild>
                                            <a href={localInterviewData.portfolio_url} target="_blank" rel="noopener noreferrer">
                                                <Briefcase className="h-4 w-4 mr-2" />
                                                View Portfolio
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Application Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center py-4">
                                    {getStatusBadge(localInterviewData.status)}
                                </div>
                                {(localInterviewData.status === 'pending' || localInterviewData.status === 'interview') && (
                                    <div className="space-y-3 pt-4 border-t">
                                        <Button
                                            onClick={handleApprove}
                                            className="w-full bg-green-600 hover:bg-green-700"
                                            disabled={isLoading}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve Candidate
                                        </Button>
                                        <Button
                                            onClick={handleReject}
                                            variant="destructive"
                                            className="w-full"
                                            disabled={isLoading}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject Candidate
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Approve Confirmation Dialog */}
            <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Approve Candidate
                        </AlertDialogTitle>
                        <div className="space-y-4">
                            {/* Score Input */}
                            <div className="border rounded-lg shadow-sm bg-white mx-auto w-fit p-8 py-6">
                                <label className="leading-none font-semibold mb-2 text-left block" htmlFor="score">
                                    Score
                                </label>
                                <input
                                    id="score"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={localInterviewData.score || ''}
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        if (Number(value) > 100) value = '100';
                                        if (Number(value) < 0) value = '0';
                                        setLocalInterviewData({ ...localInterviewData, score: value });
                                    }}
                                    className="text-4xl font-bold text-center text-gray-900 rounded px-4 py-2 w-32"
                                    placeholder="-"
                                />
                            </div>

                            {/* Notes Input */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <label className="leading-none font-semibold mb-3 block">Notes</label>

                                <div className="space-y-2">
                                    <textarea
                                        value={localInterviewData.notes_1 || ''}
                                        onChange={(e) => setLocalInterviewData({ ...localInterviewData, notes_1: e.target.value })}
                                        placeholder="Enter notes"
                                        className="w-full text-sm text-gray-700 border rounded px-3 py-2"
                                    />
                                </div>
                            </div>
                        </div>

                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmApprove}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Approve'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Confirmation Dialog */}
            <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            Reject Candidate
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject <strong>{localInterviewData.name}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmReject}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Reject'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}