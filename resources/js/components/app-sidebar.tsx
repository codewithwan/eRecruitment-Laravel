import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { File, FileAxis3D, Github, LayoutGrid, LucideFileQuestion, SearchIcon, Settings, User, Video } from 'lucide-react';
import AppLogo from './app-logo';

const dashboardNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const candidateNavItems: NavItem[] = [
    {
        title: 'Candidates',
        href: '/dashboard/candidates',
        icon: File,
    },
    {
        title: 'Reports & Analytics',
        href: '/dashboard/reports',
        icon: FileAxis3D,
    },
];

const mainNavItems: NavItem[] = [
    {
        title: 'User Management',
        href: '/dashboard/users',
        icon: User,
    },
    {
        title: 'Job Management',
        href: '/dashboard/jobs',
        icon: SearchIcon,
    },
    {
        title: 'Test & Assessment',
        href: '/dashboard/questions',
        icon: LucideFileQuestion,
    },
    {
        title: 'Interview & Scheduling',
        href: '/dashboard/interviews',
        icon: Video,
    },


];

const settingsNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Github',
        href: 'https://github.com/codewithwan/eRecruitment-Laravel',
        icon: Github,
    },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {NavMain('Dashboard', { items: dashboardNavItems })}
                {NavMain('Candidate', { items: candidateNavItems })}
                {NavMain('Management', { items: mainNavItems })}
                {NavMain('Settings', { items: settingsNavItems })}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
