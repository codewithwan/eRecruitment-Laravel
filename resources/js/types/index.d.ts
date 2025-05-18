import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    href: string;
    icon: LucideIcon | null;
    Children?: NavItem[];
}

export type NavItem = {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    children?: NavItem[]; 
};

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

