import { Card } from '@/components/ui/card';
import UserLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface CandidateInfoProps {
    users?: User | User[];
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

export default function CandidateDashboard(props: CandidateInfoProps) {
    // Initialize user state directly from props
    const user =
        Array.isArray(props.users) && props.users.length > 0 ? props.users[0] : !Array.isArray(props.users) && props.users ? props.users : null;

    return (
        <div className="space-y-8">
            <UserLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard Candidate" />
                <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-2 sm:p-4">
                    <Card className="shadow-md">
                        <div className="p-6">
                            <h2 className="mb-6 text-xl font-semibold">Candidate Information</h2>
                            {user ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2 border-r pr-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500">Name</span>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500">Email</span>
                                            <span className="font-medium">{user.email}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500">Role</span>
                                            <span className="font-medium capitalize">{user.role}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500">ID</span>
                                            <span className="font-medium">{user.id}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500">Email Verified</span>
                                            <span className="font-medium">
                                                {user.email_verified_at ? new Date(user.email_verified_at).toLocaleDateString() : 'Not verified'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500">Joined</span>
                                            <span className="font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No candidate information available.</p>
                            )}
                        </div>
                    </Card>
                </div>
            </UserLayout>
        </div>
    );
}
