import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Clock, Mail } from 'lucide-react';

// Define the type for flash messages
interface FlashMessages {
    info?: string;
    success?: string;
}

interface QuestionPack {
    id: number;
    pack_name: string;
    description: string | null;
    test_type: 'logic' | 'emotional' | 'technical' | 'psychological';
    duration: number;
    questions_count?: number;
    created_at: string;
    updated_at: string;
}

interface QuestionPackProps {
    questionPacks: QuestionPack[];
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
        title: 'Question Packs',
        href: '/dashboard/questionpacks',
    },
];

// Helper function to format test types for display
const formatTestType = (type?: string): string => {
    if (!type) return 'Unknown'; // Handle undefined or null values
    return type.charAt(0).toUpperCase() + type.slice(1);
};

// Helper function to format duration
const formatDuration = (minutes: number): string => {
    // If duration is 0 or not provided, return a default message
    if (!minutes) return '60 Minutes (Default)';

    if (minutes < 60) {
        return `${minutes} Minutes`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours} Hours ${remainingMinutes} Minutes` : `${hours} Hours`;
    }
};

// Helper function to create pack code from name
const getPackCode = (name: string): string => {
    return name.slice(0, 1).toUpperCase();
};

export default function QuestionPackManagement({ questionPacks = [] }: QuestionPackProps) {
    // UsePage hook with proper typing for flash messages
    const { props } = usePage<{ flash?: FlashMessages }>();

    // Ensure props.flash is defined with a default value
    const flash = props.flash || {};

    const handleAddPack = () => {
        // Navigate directly to the Add Package page
        router.visit('/dashboard/questionpacks/create');
    };

    const handleView = (id: number) => {
        router.visit(`/dashboard/questionpacks/${id}`);
    };

    const handleEdit = (id: number) => {
        router.visit(`/dashboard/questionpacks/${id}/edit`);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this question pack?')) {
            router.delete(`/dashboard/questionpacks/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Question Packs" />

            {/* Show flash message if present */}
            {flash.info && <div className="container mx-auto mb-4 rounded-md bg-blue-50 p-4 text-blue-700">{flash.info}</div>}
            {flash.success && <div className="container mx-auto mb-4 rounded-md bg-green-50 p-4 text-green-700">{flash.success}</div>}

            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Question Packs</h1>
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleAddPack}>
                        Add Package
                    </Button>
                </div>

                {questionPacks.length === 0 ? (
                    <div className="rounded-lg bg-gray-50 py-12 text-center">
                        <p className="text-gray-500">No question packs available</p>
                        <Button className="mt-4 bg-blue-500 hover:bg-blue-600" onClick={handleAddPack}>
                            Create Your First Package
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {questionPacks.map((pack) => (
                            <div key={pack.id} className="overflow-hidden rounded-lg border shadow-sm">
                                <div className="p-5">
                                    <div className="mb-3 flex items-center">
                                        <div className="mr-3 rounded-md bg-blue-500 p-2 text-white">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <h2 className="text-xl font-semibold">Package {getPackCode(pack.pack_name)}</h2>
                                    </div>

                                    <h3 className="mb-2 text-xl font-bold">{pack.pack_name}</h3>
                                    <p className="mb-4 text-gray-600">{pack.description || 'No description available.'}</p>

                                    <div className="mb-2 flex items-center text-sm text-gray-500">
                                        <Clock className="mr-2 h-4 w-4" />
                                        <span>
                                            {formatDuration(pack.duration)} | {pack.questions_count || 0} Questions
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">Type: {formatTestType(pack.test_type)}</p>
                                </div>

                                <div className="flex justify-end border-t bg-gray-50 px-5 py-3">
                                    <button onClick={() => handleView(pack.id)} className="mr-4 text-blue-500 hover:underline">
                                        View
                                    </button>
                                    <button onClick={() => handleEdit(pack.id)} className="mr-4 text-blue-500 hover:underline">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(pack.id)} className="text-red-500 hover:underline">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
