import UserLayout from '@/layouts/user-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, Flag, Check, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const goToQuestion = (index: number) => {
        setCurrentQuestion(index);
        setIsMobileMenuOpen(false);
    };

    const progress = (Object.keys(userAnswers).length / questions.length) * 100;

    const getQuestionStatus = (index: number) => {
        const questionId = questions[index].id;
        if (userAnswers[questionId]) {
            return markedQuestions[index] ? "answered-marked" : "answered";
        }
        return markedQuestions[index] ? "unmarked-marked" : "unmarked";
    };

    const handleSubmitTest = () => {
        // Submit test logic here
        setTestCompleted(true);
    };

    const handleBackToDashboard = () => {
        router.visit('/candidate');
    };

    // Additional stats calculation for the new navigator
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(userAnswers).length;
    const markedCount = markedQuestions.filter(Boolean).length;
    const unansweredCount = totalQuestions - answeredCount;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white shadow-sm py-3 px-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-medium text-slate-900">PT AmbaTech</h1>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                            <Progress value={progress} className="w-24 sm:w-32 h-2 bg-slate-200" />
                            <span className="text-xs font-medium text-slate-600">{Math.round(progress)}%</span>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${
                            timeLeft < 300 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'
                        }`}>
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="font-mono text-xs sm:text-sm font-medium">{formatTime(timeLeft)}</span>
                        </div>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/api/placeholder/100/100" />
                            <AvatarFallback>PT</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-6 gap-6">
                {/* Question Navigator - Desktop */}
                <div className="hidden md:block w-64 shrink-0">
                    <div className="w-64 bg-white shadow rounded-md">
                        <div className="p-4 pb-2">
                            <h3 className="text-base font-medium mb-3">Navigasi Soal</h3>
                            
                            <div className="grid grid-cols-5 gap-2">
                                {questions.map((_, idx) => {
                                    const status = getQuestionStatus(idx);
                                    return (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "flex items-center justify-center h-10 rounded-md cursor-pointer text-sm",
                                                currentQuestion === idx ? "border-2 border-gray-500" : "border border-gray-200",
                                                status === "answered" && "bg-white",
                                                status === "answered-marked" && "bg-white",
                                                status === "unmarked-marked" && "bg-white",
                                                (status === "unmarked" && !markedQuestions[idx]) && "bg-gray-100",
                                                "relative"
                                            )}
                                            onClick={() => goToQuestion(idx)}
                                        >
                                            {status === "answered" && 
                                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500"></div>
                                            }
                                            {(status === "answered-marked" || status === "unmarked-marked") && 
                                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500"></div>
                                            }
                                            {idx + 1}
                                        </div>
                                    );
                                })}
                            </div>
                            
                            <div className="mt-6 space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-green-500"></div>
                                    <span className="text-sm">Dijawab</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-orange-500"></div>
                                    <span className="text-sm">Ditandai</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-gray-200"></div>
                                    <span className="text-sm">Belum Dijawab</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mx-4 my-4 bg-gray-50 p-4 rounded-md">
                            <h3 className="font-medium text-center mb-3">Status Pengerjaan</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Dijawab:</span>
                                    <span className="font-medium">{answeredCount} dari {totalQuestions}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Ditandai:</span>
                                    <span className="font-medium">{markedCount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Belum Dijawab:</span>
                                    <span className="font-medium">{unansweredCount}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-4 pb-4">
                            <button 
                                onClick={handleSubmitTest}
                                className="w-full py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md transition-colors"
                            >
                                Akhiri Tes
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Question Content */}
                <div className="flex-1">
                    <Card className="shadow-sm border-0 rounded-lg overflow-hidden">
                        {!testCompleted ? (
                            <>
                                <CardHeader className="bg-slate-800 text-white py-4">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                            <span className="bg-white text-slate-800 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                                {currentQuestion + 1}
                                            </span>
                                            <span>
                                                Question {currentQuestion + 1} of {questions.length}
                                            </span>
                                        </CardTitle>
                                        {markedQuestions[currentQuestion] && (
                                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                                <Flag className="h-3 w-3 mr-1" /> Marked
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    {/* Mobile Progress Bar */}
                                    <div className="mt-3 block sm:hidden">
                                        <Progress value={progress} className="h-1.5 bg-slate-600" />
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-6 pb-6 px-4 sm:px-6">
                                    <p className="text-base sm:text-lg font-medium mb-5">{questions[currentQuestion].question}</p>
                                    <RadioGroup 
                                        value={userAnswers[questions[currentQuestion].id] || ""} 
                                        onValueChange={handleAnswer}
                                        className="space-y-3"
                                    >
                                        {questions[currentQuestion].options.map((option, idx) => (
                                            <div 
                                                key={idx}
                                                className={cn(
                                                    "flex items-center space-x-2 p-3 sm:p-4 rounded-lg border",
                                                    userAnswers[questions[currentQuestion].id] === option
                                                        ? "border-green-200 bg-green-50" 
                                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                                                    "transition-all"
                                                )}
                                            >
                                                <RadioGroupItem value={option} id={`option-${idx}`} />
                                                <Label htmlFor={`option-${idx}`} className="flex-grow cursor-pointer">{option}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </CardContent>

                                <CardFooter className="flex justify-between items-center px-4 sm:px-6 py-4 bg-gray-50">
                                    <Button 
                                        variant="outline" 
                                        onClick={previousQuestion} 
                                        disabled={currentQuestion === 0}
                                        className="gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" /> Previous
                                    </Button>
                                    <Button 
                                        variant={markedQuestions[currentQuestion] ? "default" : "outline"}
                                        onClick={handleMarkQuestion}
                                        className={cn(
                                            "gap-1",
                                            markedQuestions[currentQuestion] && "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                                        )}
                                    >
                                        <Flag className="h-4 w-4" /> {markedQuestions[currentQuestion] ? 'Unmark' : 'Mark'}
                                    </Button>
                                    <Button 
                                        onClick={nextQuestion}
                                        className="gap-1 bg-slate-800 hover:bg-slate-700"
                                    >
                                        Next <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <Check className="h-8 w-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-semibold mb-2">Test Completed!</h2>
                                <p className="text-gray-600 mb-6">Thank you for completing the assessment.</p>
                                <Button 
                                    className="bg-slate-800 hover:bg-slate-700"
                                    onClick={handleBackToDashboard}
                                >
                                    Back to Dashboard
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            {/* Mobile Question Navigator Button */}
            <div className="md:hidden fixed bottom-4 right-4 z-10">
                <Button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="rounded-full h-12 w-12 p-0 bg-slate-800 shadow-lg"
                >
                    {currentQuestion + 1}
                </Button>
            </div>

            {/* Mobile Question Navigator Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black/50 z-20 flex items-end">
                    <div className="bg-white rounded-t-xl w-full p-4 pb-8 animate-in slide-in-from-bottom">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Navigasi Soal</h3>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="h-8 w-8 p-0"
                            >
                                ×
                            </Button>
                        </div>
                        <ScrollArea className="h-48">
                            <div className="grid grid-cols-6 gap-2 px-1">
                                {questions.map((_, idx) => {
                                    const status = getQuestionStatus(idx);
                                    return (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "flex items-center justify-center h-10 rounded-md cursor-pointer text-sm",
                                                currentQuestion === idx ? "border-2 border-gray-500" : "border border-gray-200",
                                                status === "answered" && "bg-white",
                                                status === "answered-marked" && "bg-white",
                                                status === "unmarked-marked" && "bg-white",
                                                (status === "unmarked" && !markedQuestions[idx]) && "bg-gray-100",
                                                "relative"
                                            )}
                                            onClick={() => goToQuestion(idx)}
                                        >
                                            {status === "answered" && 
                                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500"></div>
                                            }
                                            {(status === "answered-marked" || status === "unmarked-marked") && 
                                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500"></div>
                                            }
                                            {idx + 1}
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                        
                        <div className="flex mt-4 space-x-3">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-xs">Dijawab</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span className="text-xs">Ditandai</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                                <span className="text-xs">Belum</span>
                            </div>
                        </div>
                        
                        <Button 
                            onClick={handleSubmitTest}
                            className="w-full bg-slate-600 hover:bg-slate-700 mt-4"
                        >
                            Akhiri Tes
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
