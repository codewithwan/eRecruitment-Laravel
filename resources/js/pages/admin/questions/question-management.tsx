import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Eye, Filter, Pencil, Search, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Question {
    id: number;
    question_text: string;
    options: string[];
    correct_answer: string;
    created_at: string;
    updated_at: string;
    question_packs?: { id: number; name: string }[];
}

interface TestsProps {
    questions?: Question[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Test & Assessment',
        href: '#',
    },
    {
        title: 'Question Set',
        href: '/dashboard/questions',
    },
];

export default function QuestionManagement({ questions = [] }: TestsProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Log received questions for debugging
    useEffect(() => {
        console.log('Questions received in component:', questions);
    }, [questions]);

    // Untuk filtering soal berdasarkan search
    const filteredQuestions = questions.filter((q) => q.question_text.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleAddQuestion = () => {
        router.visit('/dashboard/questions/add-questions');
    };

    const handleEditQuestion = (id: number) => {
        router.visit(`/dashboard/questions/edit/${id}`);
    };

    const handleViewQuestion = (id: number) => {
        router.visit(`/dashboard/questions/view/${id}`);
    };

    const handleDeleteQuestion = (id: number) => {
        if (confirm('Are you sure you want to delete this question?')) {
            router.delete(`/dashboard/questions/${id}`, {
                onSuccess: () => {
                    // Tidak perlu window.location.reload() -- inertia otomatis reload/refresh
                    router.reload({ only: ['questions'] });
                },
                onError: (errors) => {
                    console.error('Error deleting question:', errors);
                    alert('Failed to delete the question. Please try again.');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Question Management" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Question Set</h2>
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleAddQuestion}>
                        Add Question
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <div className="mb-4">
                            <div className="text-lg font-medium">Question List</div>
                            <div className="text-sm text-gray-500">Manage all questions in the system</div>
                        </div>

                        <div className="mb-4 flex items-center justify-between">
                            <div className="relative w-64">
                                <Search className="absolute top-2.5 left-2 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="rounded-md border">
                            <div className="grid grid-cols-12 bg-gray-50 p-4 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                <div className="col-span-1">No</div>
                                <div className="col-span-8">Question</div>
                                <div className="col-span-3 text-right">Action</div>
                            </div>

                            {filteredQuestions.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">No questions found. Add your first question!</div>
                            ) : (
                                filteredQuestions.map((question, index) => (
                                    <div
                                        key={question.id}
                                        className={`grid grid-cols-12 border-t p-4 ${index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
                                    >
                                        <div className="col-span-1">{(index + 1).toString().padStart(2, '0')}</div>
                                        <div className="col-span-8 truncate">{question.question_text || 'Question without text'}</div>
                                        <div className="col-span-3 flex justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-blue-500"
                                                onClick={() => handleViewQuestion(question.id)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-blue-500"
                                                onClick={() => handleEditQuestion(question.id)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-red-500"
                                                onClick={() => handleDeleteQuestion(question.id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
