import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ClipboardList, FileBarChart, Github, LayoutGrid, LucideFileQuestion, MessageSquare, SearchIcon, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';

const dashboardNavItems: NavItem[] = [{ title: 'Dashboard', href: '/dashboard', icon: LayoutGrid }];

const sharedSubItems: NavItem[] = [
    { title: 'Administration', href: '/dashboard/administration', icon: LayoutGrid },
    { title: 'Assessment', href: '/dashboard/assessment', icon: ClipboardList },
    { title: 'Interview', href: '/dashboard/interview', icon: MessageSquare },
    { title: 'Reports & Analytics', href: '/dashboard/reports', icon: FileBarChart },
];

const mainNavItems: NavItem[] = [
    { title: 'User Management', href: '/dashboard/users', icon: User },
    { title: 'Job Management', href: '/dashboard/jobs', icon: SearchIcon },
    { title: 'Question', href: '/dashboard/questions', icon: LucideFileQuestion },
];

const footerNavItems: NavItem[] = [{ title: 'Github', href: 'https://github.com/codewithwan/eRecruitment-Laravel', icon: Github }];

const companyNavItems: { name: string; icon: React.ElementType; items: NavItem[] }[] = [
    {
        name: 'Mitra Karya Analitika',
        icon: LayoutGrid,
        items: sharedSubItems,
    },
    {
        name: 'Autentik Karya Analitika',
        icon: ClipboardList,
        items: sharedSubItems,
    },
];

function SidebarNavGroup({ title, items }: { title: string; items: NavItem[] }) {
    const { url } = usePage();

    const isActive = (href: string) => url === href || (href === '/dashboard' && (url === '/' || url === '/dashboard'));

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarGroupContent>
                {items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                            asChild
                            className={isActive(item.href) ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-500'}
                        >
                            <Link href={item.href}>
                                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

export function AppSidebar() {
    const { url } = usePage();
    const [activeCompany, setActiveCompany] = useState<string | null>(null);

    // Use useEffect to determine which company should be active based on the current URL
    useEffect(() => {
        // If URL contains a company path, activate that company's submenu
        if (url.includes('/administration') || url.includes('/assessment') || url.includes('/interview') || url.includes('/reports')) {
            // Determine which company to make active based on a stored preference or default to first company
            // For now, we'll default to the first company
            setActiveCompany('Mitra Karya Analitika');
        }
    }, []);

    const toggleCompany = (companyName: string) => {
        setActiveCompany((prev) => (prev === companyName ? null : companyName));
    };

    const isActive = (href: string) => url === href || (href === '/dashboard' && (url === '/' || url === '/dashboard'));

    // Check if the current URL is part of a submenu to determine if we should keep it expanded

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarNavGroup title="Dashboard" items={dashboardNavItems} />

                <SidebarGroup>
                    <SidebarGroupLabel>Company</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {companyNavItems.map((company) => (
                            <SidebarMenuItem key={company.name}>
                                <SidebarMenuButton
                                    onClick={() => toggleCompany(company.name)}
                                    className={
                                        activeCompany === company.name
                                            ? 'bg-blue-100 text-blue-600 hover:bg-blue-100'
                                            : 'hover:bg-blue-50 hover:text-blue-500'
                                    }
                                >
                                    {company.icon && <company.icon className="mr-2 h-4 w-4" />}
                                    <span>{company.name}</span>
                                </SidebarMenuButton>

                                {activeCompany === company.name && (
                                    <SidebarGroupContent>
                                        {company.items.map((item) => (
                                            <SidebarMenuItem key={item.href}>
                                                <SidebarMenuButton
                                                    asChild
                                                    className={`ml-6 ${
                                                        isActive(item.href) ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-500'
                                                    }`}
                                                >
                                                    <Link href={item.href}>
                                                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarGroupContent>
                                )}
                            </SidebarMenuItem>
                        ))}
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarNavGroup title="Management" items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;
