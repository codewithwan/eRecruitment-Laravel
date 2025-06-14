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
import { ClipboardList, Github, LayoutGrid, LucideFileQuestion, Package, SearchIcon, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';

// Add CSS to remove bullet points
import '../../../resources/css/app.css';

const dashboardNavItems: NavItem[] = [{ title: 'Dashboard', href: '/dashboard', icon: LayoutGrid }];

// Test and assessment submenu items
const testAssessmentItems: NavItem[] = [
    { title: 'Question Sets', href: '/dashboard/questions', icon: ClipboardList },
    { title: 'Question Packs', href: '/dashboard/questionpacks', icon: Package },
];

// Updated main navigation items
const mainNavItems: { name: string; icon: React.ElementType; href?: string; items?: NavItem[] }[] = [
    { name: 'User Management', href: '/dashboard/users', icon: User },
    { name: 'Job Management', href: '/dashboard/jobs', icon: SearchIcon },
    { name: 'Test & Assessment', icon: LucideFileQuestion, items: testAssessmentItems },
];

const footerNavItems: NavItem[] = [{ title: 'Github', href: 'https://github.com/codewithwan/eRecruitment-Laravel', icon: Github }];

// Updated company items without sub-items
const companyNavItems: { id: number; name: string; icon: React.ElementType; href: string }[] = [
    {
        id: 1,
        name: 'Mitra Karya Analitika',
        icon: LayoutGrid,
        href: '/dashboard/periods',
    },
    {
        id: 2,
        name: 'Autentik Karya Analitika',
        icon: ClipboardList,
        href: '/dashboard/periods',
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
    const [activeManagementItem, setActiveManagementItem] = useState<string | null>(null);

    // Use useEffect to determine which sections should be active based on the current URL
    useEffect(() => {
        // If URL contains questions or questionpacks, activate the Test & Assessment section
        if (url.includes('/questions') || url.includes('/questionpacks')) {
            setActiveManagementItem('Test & Assessment');
        }
    }, [url]);

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

                <SidebarGroup>
                    <SidebarGroupLabel>Company</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {companyNavItems.map((company) => (
                            <SidebarMenuItem key={company.name}>
                                <SidebarMenuButton
                                    asChild
                                    className={
                                        url.includes(company.href) && url.includes(`companyId=${company.id}`)
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'hover:bg-blue-50 hover:text-blue-500'
                                    }
                                >
                                    <Link href={`${company.href}?companyId=${company.id}`}>
                                        {company.icon && <company.icon className="mr-2 h-4 w-4" />}
                                        <span>{company.name}</span>
                                    </Link>
                                </SidebarMenuButton>
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
                                                <div className="pt-0 pl-1">
                                                    {item.items.map((subItem) => (
                                                        <SidebarMenuItem as="div" key={subItem.href}>
                                                            <SidebarMenuButton
                                                                asChild
                                                                className={`ml-5 ${
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
                                                </div>
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
