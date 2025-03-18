import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

interface QuestionProps {
    questions?: Question[];
}

interface Question {
    id: number;
    question: string;
    options: Array<string>;
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

export default function Questions(props: QuestionProps) {
    const questions = props.questions || [];

    useEffect(() => {
        console.log('Questions:', questions);
    }
    , [questions]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Question" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Analytics Overview Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Question</h2>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <h1>Question</h1>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
