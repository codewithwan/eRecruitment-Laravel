import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Info, Plus, Save, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

// Define interfaces for our data types
interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface QuestionSubmission {
    question: string;
    options: string[];
    correct_answer: string;
}

// Define props interface for the component
interface Props {
    questionPack?: {
        id: number;
        pack_name: string;
    };
    tempQuestions?: Question[];
}

const AddQuestionPanel = ({ questionPack, tempQuestions = [] }: Props) => {
    // Get page props with proper typing
    const { params, flash = {} } = usePage<{
        params: { pack_id?: string };
        flash: { success?: string; error?: string };
    }>().props;
    const packId = params?.pack_id || questionPack?.id;

    // Log flash messages for debugging
    useEffect(() => {
        if (flash?.success) {
            console.log(flash.success);
        }
    }, [flash?.success]);

    // Set up breadcrumbs for navigation
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Test & Assessment',
            href: '#',
        },
        {
            title: 'Question Set',
            href: '/dashboard/questions',
        },
        {
            title: questionPack ? `Add Questions to ${questionPack.pack_name}` : 'Create Questions',
            href: questionPack ? `/dashboard/questions/add-questions/${packId}` : '/dashboard/questions/add-questions',
        },
    ];

    // State management
    const [questions, setQuestions] = useState<Question[]>(
        tempQuestions.length > 0 ? tempQuestions : [{ question: '', options: [''], correctAnswer: '0' }],
    );
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showNavigationWarning, setShowNavigationWarning] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState('');

    // Track form changes
    useEffect(() => {
        if (questions.some((q) => q.question || q.options.some((o) => o))) {
            setIsFormDirty(true);
        }
    }, [questions]);

    // Handle browser navigation/reload warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isFormDirty) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isFormDirty]);

    // Handle Inertia navigation warning
    useEffect(() => {
        const handleInertiaBeforeNavigate = (event: CustomEvent<{ visit: { url: string; completed: boolean } }>) => {
            if (isFormDirty && !event.detail.visit.completed) {
                event.preventDefault();
                setPendingNavigation(event.detail.visit.url);
                setShowNavigationWarning(true);
            }
        };

        document.addEventListener('inertia:before', handleInertiaBeforeNavigate as EventListener);
        return () => document.removeEventListener('inertia:before', handleInertiaBeforeNavigate as EventListener);
    }, [isFormDirty]);

    // Question handling functions
    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', options: [''], correctAnswer: '0' }]);
    };

    const handleRemoveQuestion = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[index].question = value;
        setQuestions(newQuestions);
    };

    // Option handling functions
    const handleAddOption = (qIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push('');
        setQuestions(newQuestions);
    };

    const handleRemoveOption = (qIndex: number, oIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.splice(oIndex, 1);
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (qIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = value;
        setQuestions(newQuestions);
    };

    // Navigation and form submission
    const handleSaveAndNavigate = () => {

        if (!validateForm()) {
            setShowNavigationWarning(false);
            return;
        }

        // Create payload object instead of FormData
        const filteredQuestions = questions
            .filter((q) => q.options.some((opt) => opt.trim() !== '')) 
            .map((q): QuestionSubmission => {
                const validOptions = q.options.filter((opt) => opt.trim() !== '');
                const correctAnswerIndex = parseInt(q.correctAnswer, 10);
                const safeIndex =
                    isNaN(correctAnswerIndex) || correctAnswerIndex < 0 || correctAnswerIndex >= validOptions.length ? 0 : correctAnswerIndex;

                return {
                    question: q.question.trim(),
                    options: validOptions,
                    correct_answer: validOptions[safeIndex] || validOptions[0] || '',
                };
            });

        const payload: { questions: string; question_pack_id?: number } = {
            questions: JSON.stringify(filteredQuestions),
        };

        if (packId) {
            payload.question_pack_id = typeof packId === 'string' ? parseInt(packId, 10) : packId;
        }

        // Use post with form data directly to ensure consistent handling
        router.post('/dashboard/questions', payload, {
            onSuccess: () => {
                setIsFormDirty(false);
                // Force a hard redirect to question list
                window.location.href = '/dashboard/questions';
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                alert('Failed to save questions. Please try again.');
                setShowNavigationWarning(false);
            },
        });
    };

    const validateForm = (): boolean => {
        const filteredQuestions = questions.filter((q) => q.options.some((opt) => opt.trim() !== ''));

        if (filteredQuestions.length === 0) {
            alert('Please add at least one question with valid options');
            return false;
        }

        for (let i = 0; i < filteredQuestions.length; i++) {
            const q = filteredQuestions[i];
            const validOptions = q.options.filter((opt) => opt.trim() !== '');
            const correctAnswerIndex = parseInt(q.correctAnswer);

            if (isNaN(correctAnswerIndex) || correctAnswerIndex < 0 || correctAnswerIndex >= validOptions.length) {
                alert(`Please select a valid correct answer for Question ${i + 1}`);
                return false;
            }
        }

        return true;
    };

    const submitForm = (): void => {
        const filteredQuestions = questions
            .filter((q) => q.options.some((opt) => opt.trim() !== '')) // Ensure at least one valid option exists
            .map((q): QuestionSubmission => {
                const validOptions = q.options.filter((opt) => opt.trim() !== '');
                const correctAnswerIndex = parseInt(q.correctAnswer, 10);

                // Make sure correctAnswerIndex is valid
                const safeIndex =
                    isNaN(correctAnswerIndex) || correctAnswerIndex < 0 || correctAnswerIndex >= validOptions.length ? 0 : correctAnswerIndex;

                return {
                    question: q.question.trim(),
                    options: validOptions,
                    correct_answer: validOptions[safeIndex] || validOptions[0] || '', // Ensure correct_answer is a valid option
                };
            });

        if (filteredQuestions.length === 0) {
            alert('Please add at least one valid question with options.');
            return;
        }

        console.log('Submitting questions:', filteredQuestions);

        // Create payload object instead of FormData
        const payload: { questions: string; question_pack_id?: number } = {
            questions: JSON.stringify(filteredQuestions),
        };

        if (packId) {
            payload.question_pack_id = typeof packId === 'string' ? parseInt(packId, 10) : packId;
        }

        console.log('Sending payload:', payload);

        // Use post with JSON data instead of FormData
        router.post('/dashboard/questions', { ...payload }, {
            preserveScroll: true,
            onSuccess: (response) => {
                console.log('Success response:', response);
                setIsFormDirty(false);
                
                // Always redirect back to question list after successful save
                window.location.href = '/dashboard/questions';
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
                alert('Failed to save form. Please check the form and try again.');
            },
        });
    };

    const handleCancelNavigation = (): void => {
        setPendingNavigation('');
        setShowNavigationWarning(false);
    };

    const saveForm = (): void => {
        if (!validateForm()) {
            return;
        }

        submitForm();
        setIsFormDirty(false);
    };

    const handleSubmit = (): void => {
        setShowConfirmDialog(true);
    };

    const confirmSubmit = (): void => {
        saveForm();
        setShowConfirmDialog(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={questionPack ? `Add Questions to ${questionPack.pack_name}` : 'Create Questions'} />

            {/* Show flash messages */}
            {flash?.success && (
                <div className="mx-auto mb-4 max-w-4xl rounded-md bg-green-50 p-4 text-green-800">
                    <p>{flash.success}</p>
                </div>
            )}

            {flash?.error && (
                <div className="mx-auto mb-4 max-w-4xl rounded-md bg-red-50 p-4 text-red-800">
                    <p>{flash.error}</p>
                </div>
            )}

            <div className="mx-auto py-8" style={{ width: '80%' }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {questionPack ? `Add Questions to "${questionPack.pack_name}"` : 'Create Questions'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Info box for when creating questions without a pack */}
                        {!packId && (
                            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-blue-700">
                                    <Info className="h-5 w-5" />
                                    <span className="font-medium">Create Questions First</span>
                                </div>
                                <p className="text-sm text-blue-600">
                                    You're creating questions without a question pack. After saving these questions, you'll be redirected to create a
                                    question pack to organize them.
                                </p>
                            </div>
                        )}

                        <div className="mb-6 flex items-center gap-2">
                            <Info className="h-4 w-4 text-blue-500" />
                            <span className="text-muted-foreground text-sm">
                                The question field is optional. You can leave it empty if you only want to display answer choices.
                            </span>
                        </div>

                        {/* Question editor */}
                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="mb-6 border-b pb-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Question {qIndex + 1}</h3>
                                    {questions.length > 1 && (
                                        <Button variant="ghost" size="sm" onClick={() => handleRemoveQuestion(qIndex)}>
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <Textarea
                                    placeholder="Enter question (optional)"
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                    className="mb-4"
                                />
                                <div className="mb-2 font-medium">Answer Choices:</div>
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="mb-2 flex items-center gap-2">
                                        <div className="flex-1">
                                            <Input
                                                placeholder={`Option ${oIndex + 1}`}
                                                value={option}
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            />
                                        </div>
                                        <div className="ml-2 flex items-center">
                                            <input
                                                type="radio"
                                                name={`correct-answer-${qIndex}`}
                                                checked={q.correctAnswer === oIndex.toString()}
                                                onChange={() => handleCorrectAnswerChange(qIndex, oIndex.toString())}
                                                className="mr-1 h-4 w-4"
                                            />
                                            <label className="text-sm">Correct</label>
                                        </div>
                                        {q.options.length > 1 && (
                                            <Button variant="ghost" size="sm" onClick={() => handleRemoveOption(qIndex, oIndex)}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button variant="outline" onClick={() => handleAddOption(qIndex)} className="gap-1">
                                    <Plus className="h-4 w-4" /> Add Option
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={handleAddQuestion} className="gap-1">
                            <Plus className="h-4 w-4" /> Add Question
                        </Button>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                            {packId ? 'Save Questions' : 'Continue to Create Question Pack'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Submission</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to save these questions? This action will add them to the question database.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmSubmit}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Navigation Warning Dialog */}
            <AlertDialog open={showNavigationWarning} onOpenChange={setShowNavigationWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                        <AlertDialogDescription>You have unsaved changes. Would you like to save them before navigating away?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelNavigation}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.visit(pendingNavigation)}>Discard</AlertDialogAction>
                        <Button onClick={handleSaveAndNavigate} className="gap-1">
                            <Save className="h-4 w-4" /> Save & Continue
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
};

export default AddQuestionPanel;
