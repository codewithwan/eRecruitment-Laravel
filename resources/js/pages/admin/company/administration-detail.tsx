import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Building, Calendar, CheckCircle, Clock, Download, FileText, Image, Mail, User, XCircle } from 'lucide-react';
import { useState, useCallback } from 'react';

interface CVFile {
    filename: string;
    fileType: 'pdf' | 'jpg' | 'png';
    url: string;
}

interface AdministrationUser {
    id: string;
    name: string;
    email: string;
    position: string;
    registration_date: string;
    cv: CVFile;
    company_id?: number;
    period_id?: number;
    vacancy: string;
    phone?: string;
    address?: string;
    education?: string;
    experience?: string;
    skills?: string[];
    status?: 'pending' | 'approved' | 'rejected' | 'administration';
}

interface AdministrationDetailProps {
    user: AdministrationUser;
    periodName?: string;
}

// Dummy data jika tidak ada props
const dummyUser: AdministrationUser = {
    id: '01',
    name: 'Rizal Farhan Nanda',
    email: 'rizalfarhannanda@gmail.com',
    position: 'UI / UX',
    registration_date: '2025-03-20',
    cv: {
        filename: 'rizal_cv.pdf',
        fileType: 'pdf',
        url: '/uploads/cv/rizal_cv.pdf'
    },
    company_id: 1,
    period_id: 1,
    vacancy: 'UI/UX Designer',
    phone: '+62 812-3456-7890',
    address: 'Jl. Sudirman No. 123, Jakarta Selatan',
    education: 'S1 Desain Komunikasi Visual - Universitas Indonesia (2020-2024)',
    experience: '2 tahun sebagai UI/UX Designer di PT Digital Creative',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Wireframing'],
    status: 'pending'
};

export default function AdministrationDetail({ 
    user = dummyUser, 
    periodName = 'Q1 2025 Recruitment' 
}: AdministrationDetailProps) {
    const backUrl = user.company_id && user.period_id
        ? `/dashboard/company/administration?company=${user.company_id}&period=${user.period_id}`
        : '/dashboard/company/administration';

    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Administration',
            href: '/dashboard/administration',
        },
        {
            title: user.name,
            href: `/dashboard/administration/${user.id}`,
        },
    ];

    const handleApprove = useCallback(() => {
        setIsLoading(true);
        
        // Get form data
        const scoreInput = document.getElementById('admin-score') as HTMLInputElement;
        const notesInput = document.getElementById('admin-notes') as HTMLTextAreaElement;
        
        const formData = {
            score: scoreInput?.value || '',
            notes: notesInput?.value || ''
        };

        router.post(`/dashboard/administration/${user.id}/approve`, formData, {
            onFinish: () => {
                setIsLoading(false);
                setIsApproveDialogOpen(false);
            }
        });
    }, [user.id]);

    const handleReject = useCallback(() => {
        setIsLoading(true);
        
        // Get form data
        const notesInput = document.getElementById('admin-notes') as HTMLTextAreaElement;
        
        const formData = {
            notes: notesInput?.value || ''
        };

        router.post(`/dashboard/administration/${user.id}/reject`, formData, {
            onFinish: () => {
                setIsLoading(false);
                setIsRejectDialogOpen(false);
            }
        });
    }, [user.id]);

    const getStatusBadge = useCallback((status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
        }
    }, []);

    const getCVIcon = useCallback((fileType: string) => {
        switch (fileType) {
            case 'pdf':
                return <FileText className="w-4 h-4 text-red-600" />;
            case 'jpg':
            case 'png':
                return <Image className="w-4 h-4 text-blue-600" />;
            default:
                return <FileText className="w-4 h-4 text-gray-600" />;
        }
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Administration - ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.visit(backUrl)}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Candidate Administration</h1>
                            <p className="text-gray-600">{periodName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusBadge(user.status || 'pending')}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                                        <p className="text-lg font-semibold">{user.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                                        <p className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            {user.email}
                                        </p>
                                    </div>
                                    {user.phone && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                            <p>{user.phone}</p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Registration Date</label>
                                        <p className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {new Date(user.registration_date).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                {user.address && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Address</label>
                                        <p>{user.address}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Position & Vacancy */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5" />
                                    Position Applied
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Position Category</label>
                                        <p className="text-lg font-semibold">{user.position}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Specific Vacancy</label>
                                        <p className="flex items-center gap-2">
                                            <Building className="w-4 h-4 text-gray-400" />
                                            {user.vacancy}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Education & Experience */}
                        {(user.education || user.experience) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Background</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {user.education && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Education</label>
                                            <p>{user.education}</p>
                                        </div>
                                    )}
                                    {user.experience && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Work Experience</label>
                                            <p>{user.experience}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Skills */}
                        {user.skills && user.skills.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Skills & Competencies</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {user.skills?.map((skill, index) => (
                                            <Badge key={`skill-${index}-${skill}`} variant="secondary">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* CV/Resume */}
                        <Card>
                            <CardHeader>
                                <CardTitle>CV/Resume</CardTitle>
                                <CardDescription>Download and review candidate's CV</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {getCVIcon(user.cv.fileType)}
                                        <div>
                                            <p className="font-medium text-sm">{user.cv.filename}</p>
                                            <p className="text-xs text-gray-500 uppercase">{user.cv.fileType} File</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(user.cv.url, '_blank')}
                                    >
                                        <Download className="w-4 h-4 mr-1" />
                                        Download
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Administration Review */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Administration Review</CardTitle>
                                <CardDescription>
                                    Review the candidate's documentation and decide whether to proceed to assessment.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label htmlFor="admin-score" className="text-sm font-medium text-gray-500">Score</label>
                                    <input
                                        id="admin-score"
                                        type="number"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="admin-notes" className="text-sm font-medium text-gray-500">Notes</label>
                                    <textarea
                                        id="admin-notes"
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <Button
                                        onClick={() => setIsRejectDialogOpen(true)}
                                        variant="destructive"
                                        disabled={isLoading}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject Application
                                    </Button>
                                    <Button
                                        onClick={() => setIsApproveDialogOpen(true)}
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={isLoading}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve & Send to Assessment
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center py-4">
                                    {getStatusBadge(user.status || 'pending')}
                                    <p className="text-sm text-gray-600 mt-2">
                                        {user.status === 'approved' && 'This candidate has been approved and moved to assessment phase.'}
                                        {user.status === 'rejected' && 'This application has been rejected.'}
                                        {(!user.status || user.status === 'pending') && 'Awaiting administration review.'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Approve Confirmation Dialog */}
            <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Candidate</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to approve <strong>{user.name}</strong> for the {user.vacancy} position? 
                            This will move them to the assessment phase.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsApproveDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApprove}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Approve & Send to Assessment'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Confirmation Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Application</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject <strong>{user.name}</strong>'s application for the {user.vacancy} position? 
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRejectDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Reject Application'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}