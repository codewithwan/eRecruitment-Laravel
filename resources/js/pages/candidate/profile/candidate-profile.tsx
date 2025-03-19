import UserLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Candidate',
        href: '/candidate',
    },
    {
        title: 'Your Data Profile',
        href: '/candidate/profile',
    },
];

export default function CandidateProfile() {

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Profile" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Analytics Overview Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Data</h2>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <h1>bentar</h1>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
