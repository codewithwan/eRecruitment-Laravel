import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type NavItem } from '@/types'; // Add NavItem type import
import { type PropsWithChildren } from 'react';
import { Clock, LayoutGrid, ClipboardList, MessageSquare, FileBarChart, LayoutDashboard, Building2 } from 'lucide-react';

// Define complete navigation array with proper structure
const navigation = [
    {
        title: 'Dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        href: '/dashboard',
        children: [],
    },
    {
        title: 'Periods',
        icon: <Clock className="h-5 w-5" />,
        href: '/dashboard/periods',
        children: [],
    },
    {
        title: 'Company',
        icon: <Building2 className="h-5 w-5" />,
        href: '#',
        children: [],
    }
];

// Define shared subitems
const sharedSubItems: NavItem[] = [
    { title: 'Administration', href: '/dashboard/administration', icon: LayoutGrid },
    { title: 'Assessment', href: '/dashboard/assessment', icon: ClipboardList },
    { title: 'Interview', href: '/dashboard/interview', icon: MessageSquare },
    { title: 'Reports & Analytics', href: '/dashboard/reports', icon: FileBarChart },
];

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar navigation={navigation} sharedSubItems={sharedSubItems} /> {/* Pass navigation and sharedSubItems */}
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
