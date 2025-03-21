import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Eye, Mail } from "lucide-react";

interface CandidateTest {
    id: number;
    test_type: string;
    status: string;
    scheduled_date: string;
    duration: string;
    question_count: number;
}

interface Candidate {
    id: number;
    name: string;
    email: string;
    position: string;
    tests: CandidateTest[];
}

interface CandidateTestsProps {
    testsByCandidates: {
        candidate: Candidate;
        tests: CandidateTest[];
    }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Candidate Tests',
        href: '/dashboard/candidate-tests',
    },
];

export default function CandidateTests({ testsByCandidates }: CandidateTestsProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'scheduled':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Scheduled</Badge>;
            case 'in_progress':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">In Progress</Badge>;
            case 'completed':
                return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
            case 'expired':
                return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Expired</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',  
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const handleViewTest = (id: number) => {
        // Use Inertia router for consistent navigation behavior
        router.visit(route('admin.candidate-tests.show', id));
    };

    const handleAssignTest = () => {
        // Use Inertia router for all navigation to maintain SPA behavior
        router.get(route('admin.candidate-tests.create'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Candidate Tests" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Candidate Psychometric Tests</h2>
                    <Button onClick={handleAssignTest} className="gap-2">
                        <Plus className="h-4 w-4" /> Assign New Test
                    </Button>
                </div>

                {testsByCandidates.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-4">
                        {testsByCandidates.map(({ candidate, tests }) => (
                            <AccordionItem key={candidate.id} value={`candidate-${candidate.id}`} className="border rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full text-left">
                                        <div>
                                            <h3 className="text-lg font-medium">{candidate.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Mail className="h-3 w-3" />
                                                <span>{candidate.email}</span>
                                            </div>
                                        </div>
                                        <Badge className="mt-2 sm:mt-0 self-start">{candidate.position}</Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Test Type</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Scheduled Date</TableHead>
                                                <TableHead>Duration</TableHead>
                                                <TableHead>Questions</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tests.map((test) => (
                                                <TableRow key={test.id}>
                                                    <TableCell className="font-medium">{test.test_type}</TableCell>
                                                    <TableCell>{getStatusBadge(test.status)}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3 text-gray-500" />
                                                            <span>{formatDate(test.scheduled_date)}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3 text-gray-500" />
                                                            <span>{test.duration}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{test.question_count}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            onClick={() => handleViewTest(test.id)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 mb-4">No tests have been assigned to candidates yet.</p>
                        <Button onClick={handleAssignTest} className="gap-2">
                            <Plus className="h-4 w-4" /> Assign New Test
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
