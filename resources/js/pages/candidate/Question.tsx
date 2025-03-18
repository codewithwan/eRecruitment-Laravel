import UserLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard Candidate', href: '/candidate' },
    { title: 'Test Questions', href: '/candidate/questions' },
];

interface Question {
    id: number;
    question: string;
    options: string[];
}

type PageProps = InertiaPageProps & {
    questions: Question[];
    userAnswers: Record<number, string>;
};

export default function CandidateQuestions() {
    const { questions, userAnswers: initialUserAnswers } = usePage<PageProps>().props;
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>(initialUserAnswers || {});
    const [markedQuestions, setMarkedQuestions] = useState(Array(questions.length).fill(false));
    const [saving, setSaving] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30 * 60); // Timer 30 menit
    const [testCompleted, setTestCompleted] = useState(false);

    useEffect(() => {
        if (timeLeft > 0 && !testCompleted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !testCompleted) {
            setTestCompleted(true);
        }
    }, [timeLeft, testCompleted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = async (answer: string) => {
        const questionId = questions[currentQuestion].id;
        setUserAnswers(prev => ({ ...prev, [questionId]: answer }));

        try {
            setSaving(true);
            await axios.post('/candidate/questions/answer', { question_id: questionId, answer: answer });
        } catch (error) {
            console.error('Failed to save answer:', error);
        } finally {
            setSaving(false);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) setCurrentQuestion(prev => prev + 1);
    };

    const previousQuestion = () => {
        if (currentQuestion > 0) setCurrentQuestion(prev => prev - 1);
    };

    const handleMarkQuestion = () => {
        const newMarked = [...markedQuestions];
        newMarked[currentQuestion] = !newMarked[currentQuestion];
        setMarkedQuestions(newMarked);
    };

    const progress = (Object.keys(userAnswers).length / questions.length) * 100;

    return (
        <UserLayout breadcrumbs={breadcrumbs}>
            <Head title="Test Questions" />
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <nav className="bg-white shadow-sm py-4 px-6 mb-8">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-800">PT AmbaTech</h1>
                        <div className="flex items-center gap-4">
                            <Progress value={progress} className="w-32 h-2 bg-gray-200" />
                            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-black'}`}>
                                <Clock className="h-4 w-4" />
                                <span className="font-mono text-sm font-medium">{formatTime(timeLeft)}</span>
                            </div>
                            <Avatar>
                                <AvatarImage src="/api/placeholder/100/100" />
                                <AvatarFallback>PT</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </nav>

                <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-6">
                    <Card className="w-full shadow-lg border-0 rounded-xl overflow-hidden">
                        {!testCompleted ? (
                            <>
                                <CardHeader className="bg-gray-600 text-white">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <span className="bg-white text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                            {currentQuestion + 1}
                                        </span>
                                        Question {currentQuestion + 1} of {questions.length}
                                    </CardTitle>
                                    {markedQuestions[currentQuestion] && (
                                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                            <Flag className="h-3 w-3 mr-1" /> Marked
                                        </Badge>
                                    )}
                                </CardHeader>

                                <CardContent className="pt-6 pb-8 px-6">
                                    <p className="text-lg">{questions[currentQuestion].question}</p>
                                    <RadioGroup value={userAnswers[questions[currentQuestion].id] || ""} onValueChange={handleAnswer} className="space-y-3">
                                        {questions[currentQuestion].options.map((option, idx) => (
                                            <div key={idx} className="flex items-center space-x-2 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
                                                <RadioGroupItem value={option} id={`option-${idx}`} className="border-gray-400 text-gray-600" />
                                                <Label htmlFor={`option-${idx}`} className="flex-grow cursor-pointer">{option}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </CardContent>

                                <CardFooter className="flex justify-between items-center px-6 py-4">
                                    <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0} className="gap-1">
                                        <ChevronLeft className="h-4 w-4" /> Previous
                                    </Button>
                                    <Button variant="outline" onClick={handleMarkQuestion} className="gap-1">
                                        <Flag className="h-4 w-4" /> {markedQuestions[currentQuestion] ? 'Unmark' : 'Mark'}
                                    </Button>
                                    <Button onClick={nextQuestion} className="gap-1 bg-gray-600 hover:bg-gray-700">
                                        Next <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </>
                        ) : (
                            <div className="p-8 text-center">Thank you for completing the test!</div>
                        )}
                    </Card>
                </div>
            </div>
        </UserLayout>
    );
}
