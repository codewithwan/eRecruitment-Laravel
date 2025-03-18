import UserLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Candidate',
        href: '/candidate',
    },
];

interface UserData {
    user: {
        id: number;
        name: string;
        email: string;
        created_at: string;
    };
}

export default function CandidatePsychotest() {
    const { userData } = usePage<{ userData: UserData }>().props;

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Test Psikotes" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Portal Kandidat</h2>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-600">Nama:</p>
                                <p className="font-medium">{userData.user.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Email:</p>
                                <p className="font-medium">{userData.user.email}</p>
                            </div>
                            <div className="pt-4">
                                <Link
                                    href="/candidate/questions"
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Mulai Test Psikotes
                                    <svg 
                                        className="ml-2 w-4 h-4" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M14 5l7 7m0 0l-7 7m7-7H3" 
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}