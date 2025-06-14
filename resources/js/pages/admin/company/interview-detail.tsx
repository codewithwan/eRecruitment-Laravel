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
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    skills: string[];
    experience_years: number;
    education: string;
    portfolio_url?: string;
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

export default function InterviewDetail({ userId }: InterviewDetailProps) {
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Mock interview data - replace with actual data fetching
    const interviewData: InterviewData = {
        id: userId,
        name: 'Rizal Farhan Nanda',
        email: 'rizalfarhannanda@gmail.com',
        position: 'UI / UX Designer',
        registration_date: '2025-03-20',
        phone: '+62 812-3456-7890',
        cv_url: '/files/cv-rizal-farhan.pdf',
        interview_date: '2025-03-25',
        interview_time: '10:00',
        status: 'pending',
        notes: 'Strong portfolio in mobile app design. Good understanding of user research.',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Prototyping', 'Wireframing'],
        experience_years: 3,
        education: 'Bachelor of Design - Visual Communication Design',
        portfolio_url: 'https://rizalfarhan.portfolio.com'
    };

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
        router.visit('/dashboard/company/interview');
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
            <Head title={`Interview - ${interviewData.name}`} />
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
                    {getStatusBadge(interviewData.status)}
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
                                        <p className="text-base font-medium text-gray-900">{interviewData.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email</label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <p className="text-base text-gray-900">{interviewData.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Phone</label>
                                        <p className="text-base text-gray-900">{interviewData.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Applied Position</label>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-gray-400" />
                                            <p className="text-base font-medium text-gray-900">{interviewData.position}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Registration Date</label>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <p className="text-base text-gray-900">
                                                {format(new Date(interviewData.registration_date), 'MMMM dd, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Experience</label>
                                        <p className="text-base text-gray-900">{interviewData.experience_years} years</p>
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
                                        {interviewData.skills.map((skill, index) => (
                                            <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Education</label>
                                    <p className="text-base text-gray-900">{interviewData.education}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interview Notes */}
                        {interviewData.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Interview Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 leading-relaxed">{interviewData.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Interview Schedule */}
                        {interviewData.interview_date && (
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
                                            {format(new Date(interviewData.interview_date), 'EEEE, MMMM dd, yyyy')}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Time</label>
                                        <p className="text-base text-gray-900">{interviewData.interview_time} WIB</p>
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
                                {interviewData.cv_url && (
                                    <div>
                                        <Button variant="outline" className="w-full justify-start" asChild>
                                            <a href={interviewData.cv_url} target="_blank" rel="noopener noreferrer">
                                                <FileText className="h-4 w-4 mr-2" />
                                                View CV/Resume
                                            </a>
                                        </Button>
                                    </div>
                                )}
                                {interviewData.portfolio_url && (
                                    <div>
                                        <Button variant="outline" className="w-full justify-start" asChild>
                                            <a href={interviewData.portfolio_url} target="_blank" rel="noopener noreferrer">
                                                <Briefcase className="h-4 w-4 mr-2" />
                                                View Portfolio
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Decision Actions */}
                        {interviewData.status === 'pending' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Make Decision</CardTitle>
                                    <CardDescription>Approve or reject this candidate</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
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
                                </CardContent>
                            </Card>
                        )}
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
                        <AlertDialogDescription>
                            Are you sure you want to approve <strong>{interviewData.name}</strong> for the position of{' '}
                            <strong>{interviewData.position}</strong>? This will move them to the reports section.
                        </AlertDialogDescription>
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
                            Are you sure you want to reject <strong>{interviewData.name}</strong>? This action cannot be undone.
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