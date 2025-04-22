import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { File, Github, LayoutGrid, LucideFileQuestion, SearchIcon, User } from 'lucide-react';
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
];

const mainNavItems: NavItem[] = [
    {
        title: 'User Management',
        href: '/dashboard/users',
        icon: User,
    },
    {
        title: 'Jobs Hiring',
        href: '/dashboard/jobs',
        icon: SearchIcon,
    },
    {
        title: 'Question',
        href: '/dashboard/questions',
        icon: LucideFileQuestion,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Github',
        href: 'https://github.com/codewithwan/eRecruitment-Laravel',
        icon: Github,
    },
];

// Custom Nav function that highlights active items
function NavMain(title: string, { items }: { items: NavItem[] }) {
    const { url } = usePage();

    return (
        <SidebarMenu>
            <div className="px-4 py-2">
                <h2 className="text-muted-foreground px-2 text-xs font-semibold tracking-tight">{title}</h2>
            </div>
            {items.map((item) => {
                // Check if current URL matches exactly this nav item
                // For Dashboard, handle the root URL case specifically
                let isActive = false;
                if (item.href === '/dashboard') {
                    // Dashboard is active only if URL is exactly /dashboard or /
                    isActive = url === '/dashboard' || url === '/';
                } else {
                    // For other items, match the exact path
                    isActive = url === item.href;
                }

                return (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                            asChild
                            className={
                                isActive ? 'bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-600' : 'hover:bg-blue-50 hover:text-blue-500'
                            }
                            onClick={(e) => {
                                // Prevent navigation if clicking on already active item
                                if (isActive) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}

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
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
