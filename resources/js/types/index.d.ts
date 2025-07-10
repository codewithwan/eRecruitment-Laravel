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
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        profile?: {
            full_name: string;
            phone: string;
            address: string;
            birth_place: string;
            birth_date: string;
            gender: string;
        };
    };
    vacancy_period: {
        vacancy: {
            title: string;
            company?: {
                id: number;
                name: string;
            };
        };
    };
    stages?: {
        psychological_test?: {
            score?: number;
        };
        interview?: {
            scheduled_at?: string;
            completed_at?: string;
            score?: number;
            interviewer?: {
                name: string;
                email: string;
            };
        };
    };
    assessment?: {
        answers?: Array<{
            question: string;
            answer: string;
            is_correct: boolean;
            score: number;
        }>;
        total_score?: number;
    };
    history?: Array<{
        processed_at: string;
        completed_at?: string;
        score?: number;
        notes?: string;
        reviewed_by?: string;
    }>;
    created_at: string;
}

