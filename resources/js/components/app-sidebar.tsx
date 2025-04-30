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
import { ClipboardList, FileBarChart, Github, LayoutGrid, LucideFileQuestion, MessageSquare, Package, SearchIcon, User, Clock, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';

const dashboardNavItems: NavItem[] = [{ title: 'Dashboard', href: '/dashboard', icon: LayoutGrid }];

// Simplify periods navigation items - just the list item
const periodsNavItems: NavItem[] = [{ title: 'Periods List', href: '/dashboard/periods', icon: Clock }];

const sharedSubItems: NavItem[] = [
    { title: 'Administration', href: '/dashboard/company/administration', icon: LayoutGrid }, // Changed back to original path
    { title: 'Assessment', href: '/dashboard/assessment', icon: ClipboardList },
    { title: 'Interview', href: '/dashboard/interview', icon: MessageSquare },
    { title: 'Reports & Analytics', href: '/dashboard/reports', icon: FileBarChart },
];

// Test and assessment submenu items
const testAssessmentItems: NavItem[] = [
    { title: 'Question Set', href: '/dashboard/questions', icon: ClipboardList },
    { title: 'Question Packs', href: '/dashboard/questionpacks', icon: Package }, // Ensure this matches the route
];

// Updated main navigation items to include Test & Assessment as a dropdown item
const mainNavItems: { name: string; icon: React.ElementType; href?: string; items?: NavItem[] }[] = [
    { name: 'User Management', href: '/dashboard/users', icon: User },
    { name: 'Job Management', href: '/dashboard/jobs', icon: SearchIcon },
    { name: 'Test & Assessment', icon: LucideFileQuestion, items: testAssessmentItems },
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

export function AppSidebar({ navigation, sharedSubItems }: { navigation: any[], sharedSubItems: NavItem[] }) {
    const { url } = usePage();
    const [activeCompany, setActiveCompany] = useState<string | null>(null);
    const [activeManagementItem, setActiveManagementItem] = useState<string | null>(null);

    // Use useEffect to determine which sections should be active based on the current URL
    useEffect(() => {
        // If URL contains a company path, activate that company's submenu
        if (url.includes('/administration') || url.includes('/assessment') || url.includes('/interview') || url.includes('/reports')) {
            setActiveCompany('Mitra Karya Analitika');
        }

        // If URL contains questions or question-packs, activate the Test & Assessment section
        if (url.includes('/questions') || url.includes('/question-packs')) {
            setActiveManagementItem('Test & Assessment');
        }
    }, [url]);

    const toggleCompany = (companyName: string) => {
        setActiveCompany((prev) => (prev === companyName ? null : companyName));
    };

    const toggleManagementItem = (itemName: string) => {
        setActiveManagementItem((prev) => (prev === itemName ? null : itemName));
    };

    const isActive = (href: string) => url === href || (href === '/dashboard' && (url === '/' || url === '/dashboard'));

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

                {/* Simplified Periods Section with just the list link */}
                <SidebarGroup>
                    <SidebarGroupLabel>Periods</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                className={isActive('/dashboard/periods') ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-500'}
                            >
                                <Link href="/dashboard/periods">
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span>Periods List</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarGroupContent>
                </SidebarGroup>

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
                                                    <Link
                                                        href={
                                                            activeCompany 
                                                                ? `${item.href}?companyId=${company.name === 'Mitra Karya Analitika' ? 1 : 2}`
                                                                : item.href
                                                        }
                                                    >
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

                {/* Management Section with nested Test & Assessment */}
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {mainNavItems.map((item) => (
                            <SidebarMenuItem key={item.name}>
                                {/* If the item has a dropdown (like Test & Assessment) */}
                                {item.items ? (
                                    <>
                                        <SidebarMenuButton
                                            onClick={() => toggleManagementItem(item.name)}
                                            className={
                                                activeManagementItem === item.name
                                                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-100'
                                                    : 'hover:bg-blue-50 hover:text-blue-500'
                                            }
                                        >
                                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                            <span>{item.name}</span>
                                        </SidebarMenuButton>

                                        {activeManagementItem === item.name && (
                                            <SidebarGroupContent>
                                                {item.items.map((subItem) => (
                                                    <SidebarMenuItem key={subItem.href}>
                                                        <SidebarMenuButton
                                                            asChild
                                                            className={`ml-6 ${
                                                                isActive(subItem.href)
                                                                    ? 'bg-blue-100 text-blue-600'
                                                                    : 'hover:bg-blue-50 hover:text-blue-500'
                                                            }`}
                                                        >
                                                            <Link href={subItem.href}>
                                                                {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                ))}
                                            </SidebarGroupContent>
                                        )}
                                    </>
                                ) : (
                                    /* Regular menu item without dropdown */
                                    <SidebarMenuButton
                                        asChild
                                        className={isActive(item.href!) ? 'bg-blue-100 text-blue-600' : 'hover:bg-blue-50 hover:text-blue-500'}
                                    >
                                        <Link href={item.href!}>
                                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        ))}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;
