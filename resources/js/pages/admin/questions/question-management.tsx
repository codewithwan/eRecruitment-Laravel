import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Clock } from 'lucide-react';

interface Test {
    id: number;
    title: string;
    description: string;
    duration: string;
    test_type: string;
    questions_count: number;
    created_at: string;
    updated_at: string;
}

interface TestsProps {
    tests: Test[];
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
    const { tests } = props;

    const handleAddTest = () => {
        router.visit('/dashboard/questions/add-questions');
    };

    const handleEditTest = (id: number) => {
        router.visit(`/dashboard/questions/edit/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Test Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Test Management</h2>
                    <Button className="mx-10 px-10" onClick={handleAddTest}>
                        Add Test
                    </Button>
                </div>

                {tests.length === 0 ? (
                    <div className="flex h-40 items-center justify-center">
                        <p className="text-gray-500">No tests available. Create your first test!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {tests.map((test) => (
                            <Card key={test.id} className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>{test.title}</CardTitle>
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                        <Clock className="mr-1 h-4 w-4" />
                                        <span>
                                            {test.duration} min | {test.questions_count} questions
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 dark:text-gray-200">{test.description}</p>
                                    <p className="mt-2 text-gray-500 dark:text-gray-400">Type: {test.test_type}</p>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button variant="outline" onClick={() => handleEditTest(test.id)}>
                                        Edit Test
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))} 
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
