export interface Question {
    id: number;
    question_text: string;
    options: string[];
    assessment_id: number;
}

export interface Assessment {
    id: number;
    title: string;
    description: string;
    test_type: string;
    duration: string;
    questions: Question[];
}

export interface Test {
    id: number;
    title: string;
    description: string;
    duration: string;
    test_type: string;
    questions_count: number;
    created_at: string;
    updated_at: string;
}

export interface TestsProps {
    tests: Test[];
}

export interface EditQuestionsProps {
    assessment: Assessment;
}
