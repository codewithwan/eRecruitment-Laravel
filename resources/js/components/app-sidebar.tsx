import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { File, Github, LayoutGrid, LucideFileQuestion, SearchIcon, User, FileText, Package, FileAxis3D } from 'lucide-react'; // Tambahkan ikon untuk submenu
import AppLogo from './app-logo';
import { useState } from 'react';

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
        href: '/dashboard/questions/question-set',
        icon: LucideFileQuestion,
        children: [
            {
                title: 'Question Set',
                href: '/dashboard/questions/question-set',
                icon: FileText, 
            },
            {
                title: 'Question Packs',
                href: '/dashboard/questions/question-packs',
                icon: Package, 
            },
        ],
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
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    return (
        <SidebarMenu>
            <div className="px-4 py-2">
                <h2 className="text-muted-foreground px-2 text-xs font-semibold tracking-tight">{title}</h2>
            </div>
            {items.map((item) => {
                // Perbaiki logika isActive
                const isActive = item.children
                    ? false // Menu utama tidak pernah aktif
                    : url.startsWith(item.href); // Aktif jika URL cocok dengan menu utama (tanpa submenu)

                const isExpanded = expandedMenu === item.title || (item.children && item.children.some((subItem) => url.startsWith(subItem.href)));

                return (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                            asChild
                            className={
                                isActive
                                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-600'
                                    : 'hover:bg-blue-50 hover:text-blue-500'
                            }
                            onClick={(e) => {
                                if (item.children) {
                                    e.preventDefault();
                                    setExpandedMenu(isExpanded ? null : item.title);

                                    // Navigate to the default child (Question Set) if not expanded
                                    if (!isExpanded) {
                                        router.visit(item.children[0].href); // Default to the first child
                                    }
                                }
                            }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>

                        {/* Render submenu if expanded */}
                        {item.children && isExpanded && (
                            <SidebarMenuSub>
                                {item.children.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.href}>
                                        <SidebarMenuSubButton
                                            href={subItem.href}
                                            className={
                                                url.startsWith(subItem.href)
                                                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-600'
                                                    : 'hover:bg-blue-50 hover:text-blue-500'
                                            }
                                        >
                                            {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                                            {subItem.title}
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        )}
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
