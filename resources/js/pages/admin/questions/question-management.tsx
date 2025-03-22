import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Plus, Pencil } from "lucide-react";

interface Question {
    id: number;
    question: string;
    options: string[];
    test_type: string;
    duration: string;
    created_at: string;
}

interface Test {
    id: number;
    title: string;
    description: string;
    time_limit: string;
    question_count: number;
    test_type: string;
    questions: Question[];
}

interface TestsProps {
    tests?: Test[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Question Management',
        href: '/dashboard/questions',
    },
];

export default function Tests(props: TestsProps) {
    const tests = props.tests || [];
    
    // Sample data for testing if no props are provided
    const sampleTests = [
        {
            id: 1,
            title: "Tes Kepribadian MBTI",
            description: "Tes untuk mengukur preferensi psikologis Anda dalam bagaimana Anda membuat keputusan dan berinteraksi dengan dunia.",
            time_limit: "45 menit",
            question_count: 100,
            test_type: "Personality Assessment",
            questions: []
        },
        {
            id: 2,
            title: "Tes Kepemimpinan",
            description: "Tes untuk mengukur gaya kepemimpinan dan kemampuan memimpin dalam berbagai situasi.",
            time_limit: "30 menit",
            question_count: 50,
            test_type: "Leadership Assessment",
            questions: []
        },
        {
            id: 3,
            title: "Tes Etika Kerja",
            description: "Tes untuk mengukur sikap dan perilaku Anda dalam lingkungan kerja profesional.",
            time_limit: "25 menit",
            question_count: 40,
            test_type: "Work Ethic Assessment",
            questions: []
        }
    ];

    const displayTests = tests.length > 0 ? tests : sampleTests;
    
    const handleAddTestClick = () => {
        window.location.href = route('admin.questions.create');
        // Or if route() helper isn't available:
        // window.location.href = '/dashboard/add-questions';
    };

    const handleEditTest = (id: string) => {
        window.location.href = route('admin.questions.edit', id);
        // Or if route() helper isn't available:
        // window.location.href = `/dashboard/questions/${id}/edit`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Psychometric Tests" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Kelola Tes Psikotes</h2>
                    <Button onClick={handleAddTestClick} className="gap-2">
                        <Plus className="h-4 w-4" /> Tambah Tes
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayTests.map((test) => (
                        <Card key={test.id} className="shadow-sm">
                            <CardHeader>
                                <CardTitle>{test.title}</CardTitle>
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{test.time_limit} | {test.question_count} soal</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{test.description}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button 
                                    variant="outline" 
                                    onClick={() => handleEditTest(test.id.toString())}
                                >
                                    Edit Tes
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {displayTests.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 mb-4">Belum ada tes psikotes yang tersimpan.</p>
                        <Button onClick={handleAddTestClick} className="gap-2">
                            <Plus className="h-4 w-4" /> Tambah Tes
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}