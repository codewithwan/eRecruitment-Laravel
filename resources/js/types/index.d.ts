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

export type RecruitmentStage = 'administrative_selection' | 'psychological_test' | 'interview';

export type AdministrativeStatus = 'pending' | 'passed' | 'failed';

export type AssessmentStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'passed' | 'failed';

export type InterviewStatus = 'scheduled' | 'completed' | 'passed' | 'failed';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface RecruitmentStageInfo {
  stage: RecruitmentStage;
  status: AdministrativeStatus | AssessmentStatus | InterviewStatus;
  updatedAt?: string;
  reviewedBy?: string;
  notes?: string;
  score?: number;
  scheduledAt?: string;
  location?: string;
}

export interface CompanyInfo {
    name: string;
}

export interface PeriodInfo {
    name: string;
    start_date: string;
    end_date: string;
}

export interface ApplicationInfo {
    id: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    vacancy_period: {
        vacancy: {
            title: string;
        };
    };
    created_at: string;
    position: string;
    stages?: {
        administrative_selection?: {
            status: AdministrativeStatus;
            notes?: string;
            reviewed_by?: string;
            updated_at?: string;
        };
        psychological_test?: {
            status: AssessmentStatus;
            score?: number;
            completed_at?: string;
            notes?: string;
            reviewed_by?: string;
        };
        interview?: {
            status: InterviewStatus;
            scheduled_at?: string;
            completed_at?: string;
            interviewer?: {
                name: string;
                email: string;
            };
            notes?: string;
            score?: number;
        };
    };
    status?: string;
    score?: number;
    scheduled_at?: string;
    interviewer?: {
        name: string;
        email: string;
    };
}

