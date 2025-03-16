import UserSidebarLayout from '@/layouts/user/user-app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <UserSidebarLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </UserSidebarLayout>
);
