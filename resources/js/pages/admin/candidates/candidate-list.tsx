import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

// interface QuestionProps {
//     questions?: Question[];
// }

// interface Question {
//     id: number;
//     question: string;
//     options: Array<string>;
// }

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Candidate',
        href: '/dashboard',
    },
    {
        title: 'Candidate Lists',
        href: '/dashboard/candidates',
    },
];

export default function CandidateLists() {
    // const questions = props.questions || [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Question" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Analytics Overview Section */}
                <div>
                    <h2 className="mb-4 text-2xl font-semibold">Candidate Lists</h2>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <h1>Lists</h1>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
