// import { PageProps } from '@inertiajs/core';

export interface CandidateProfile {
    id: number;
    user_id: number;
    phone: string;
    address: string;
    birth_date: string;
    birth_place: string;
    gender: 'male' | 'female';
    religion: string;
    marital_status: string;
    nationality: string;
}

export interface CandidateEducation {
    id: number;
    user_id: number;
    level: string;
    institution: string;
    major: string;
    start_year: number;
    end_year: number;
    gpa: number;
}

export interface CandidateLanguage {
    id: number;
    user_id: number;
    name: string;
    level: string;
}

export interface CandidateCertification {
    id: number;
    user_id: number;
    name: string;
    issuer: string;
    date: string;
}

export interface CandidateWorkExperience {
    id: number;
    user_id: number;
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    description: string;
}

export interface CandidateOrganization {
    id: number;
    user_id: number;
    name: string;
    position: string;
    start_year: number;
    end_year: number;
}

export interface CandidateSkill {
    id: number;
    user_id: number;
    skill_name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    candidatesProfile?: CandidateProfile;
    candidatesEducations?: CandidateEducation[];
    candidatesSkills?: CandidateSkill[];
    candidatesLanguages?: CandidateLanguage[];
    candidatesCertifications?: CandidateCertification[];
    candidatesWorkExperiences?: CandidateWorkExperience[];
    candidatesOrganizations?: CandidateOrganization[];
    candidatesCV?: { path: string; };
}

export interface Application {
    id: number;
    user: {
        name: string;
        email: string;
        candidates_profile?: {
            phone: string;
            address: string;
            birth_date: string;
            birth_place: string;
        };
        candidates_educations?: Array<{
            id: number;
            institution: string;
            major: string;
            start_date: string;
            end_date: string;
            gpa: number;
        }>;
        candidates_work_experiences?: Array<{
            id: number;
            company: string;
            position: string;
            start_date: string;
            end_date: string;
            description: string;
        }>;
        candidates_skills?: Array<{
            id: number;
            name: string;
            level: string;
        }>;
    };
    vacancy_period: {
        vacancy: {
            title: string;
        };
    };
    created_at: string;
}

export interface Pagination<T> {
    current_page: number;
    per_page: number;
    total: number;
    data: T[];
}

export interface ApplicationResponse {
    applications: Pagination<Application>;
}

export interface UseApplicationDataParams {
    period?: string;
    company?: string;
    search?: string;
    status: number;
    page: number;
}

export interface ApplicationPageProps {
    applications: {
        data: Application[];
        current_page: number;
        per_page: number;
        total: number;
    };
}

export interface CustomPageProps {
    applications: {
        data: Application[];
        // Add other pagination fields if needed
    };
} 