import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

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

export default function QuestionManagement(props: TestsProps) {
    const tests = props.tests || [];

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

    const handleAddTest = () => {
        console.log("Add new test");
        router.visit('/dashboard/questions/add-questions');
    };

    const handleEditTest = (id: string) => {
        console.log(`Edit test with ID: ${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Test management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Jobs Management</h2>
                    <Button className='px-10 mx-10' onClick={handleAddTest}>Add Job</Button>
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
                
            </div>
        </AppLayout>
    );
}