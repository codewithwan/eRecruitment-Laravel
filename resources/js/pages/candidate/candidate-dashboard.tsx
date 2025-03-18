import UserLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface CandidateInfoProps {
    users?: User[];
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Candidate',
        href: '/candidate',
    },
];

export default function CandidatePsychotest(props: CandidateInfoProps) {
    // console.log('Props users:', props.users); // Log the props.users value
    const users = Array.isArray(props.users) ? props.users : props.users ? [props.users] : [];

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Test Psikotes" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Analytics Overview Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Portal Kandidat</h2>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                        <h1>Ini adalah halaman portal kandidat</h1>
                        <div className="grid gap-4">
                            {users.map(user => (
                                <div key={user.id} className="p-4 border rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold">{user.name}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    <p className="text-sm text-gray-600">{user.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
