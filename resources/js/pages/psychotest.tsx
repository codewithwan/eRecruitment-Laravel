import UserLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Test Psikotes',
        href: '/psychotest',
    },
];

export default function Psychotest() {

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Test Psikotes" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Analytics Overview Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Kamu User</h2>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <h1>kamu user</h1>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
