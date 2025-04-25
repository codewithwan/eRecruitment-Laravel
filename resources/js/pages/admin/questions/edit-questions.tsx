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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Info, Plus, Save, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Question {
    id: number;
    question: string;
    options: string[];
    assessment_id: number;
    correctAnswer?: string;
}

interface Assessment {
    id: number;
    title: string;
    description: string;
    test_type: string;
    duration: string;
    questions: Question[];
}

interface EditQuestionsProps {
    assessment: Assessment;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Question Management',
        href: '/dashboard/questions',
    },
    {
        title: 'Edit Test',
        href: '#',
    },
];

const testTypes = ['Logic', 'Numeric', 'Verbal'];
const durations = ['10 Minutes', '20 Minutes', '30 Minutes', '40 Minutes'];

export default function EditQuestions({ assessment }: EditQuestionsProps) {
    const [title, setTitle] = useState(assessment.title);
    const [description, setDescription] = useState(assessment.description);
    const [questions, setQuestions] = useState<Question[]>(assessment.questions || []);
    const [selectedTestType, setSelectedTestType] = useState(assessment.test_type);
    const [selectedDuration, setSelectedDuration] = useState(assessment.duration);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showNavigationWarning, setShowNavigationWarning] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState('');

    // Track form changes
    useEffect(() => {
        const handleFormChange = () => setIsFormDirty(true);

        if (
            title !== assessment.title || 
            description !== assessment.description || 
            selectedTestType !== assessment.test_type || 
            selectedDuration !== assessment.duration || 
            JSON.stringify(questions) !== JSON.stringify(assessment.questions)
        ) {
            handleFormChange();
        }
    }, [title, description, selectedTestType, selectedDuration, questions, assessment]);

    // Handle browser navigation events
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

    // Intercept Inertia navigation
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

    const handleAddQuestion = () => {
        setQuestions([...questions, { 
            id: Date.now(), // temporary ID for new questions
            question: '', 
            options: [''], 
            assessment_id: assessment.id,
            correctAnswer: ''
        }]);
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

    const handleSaveAndNavigate = () => {
        saveForm();
        if (pendingNavigation) {
            router.visit(pendingNavigation);
        }
        setShowNavigationWarning(false);
    };

    const handleCancelNavigation = () => {
        setPendingNavigation('');
        setShowNavigationWarning(false);
    };

    const saveForm = () => {
        // Validate required fields
        if (!title || !description || !selectedTestType || !selectedDuration) {
            alert('Please fill out all required fields (title, description, test type, and duration)');
            return;
        }
        
        console.log('Saving form data', {
            title,
            description,
            testType: selectedTestType,
            duration: selectedDuration,
            questions,
        });

        // Filter out empty questions and prepare valid questions with proper formatting
        const validQuestions = questions
            .filter((q) => q.options.some((opt) => opt.trim() !== ''))
            .map(q => ({
                id: q.id,
                question: q.question || '',
                options: q.options.filter(opt => opt.trim() !== '')
            }));
        
        console.log('Sending to server:', {
            title,
            description,
            test_type: selectedTestType,
            duration: selectedDuration,
            questions: validQuestions
        });

        // Send data directly without stringifying questions
        router.put(`/dashboard/questions/${assessment.id}`, {
            title,
            description,
            test_type: selectedTestType,
            duration: selectedDuration,
            questions: validQuestions,  // Send as direct object, not JSON string
        }, {
            onSuccess: (page) => {
                setIsFormDirty(false);
                console.log('Update successful!', page);
                
                if (page.props.flash && typeof page.props.flash === 'object' && 'error' in page.props.flash) {
                    alert('Error: ' + page.props.flash.error);
                    return;
                }
                
                router.visit('/dashboard/questions');
            },
            onError: (errors) => {
                console.error('Update failed:', errors);
                const errorMessage = typeof errors === 'object' 
                    ? Object.values(errors).flat().join('\n') 
                    : 'Failed to update assessment. Please try again.';
                alert('Error: ' + errorMessage);
            }
        });
    };

    const handleSubmit = () => {
        setShowConfirmDialog(true);
    };

    const confirmSubmit = () => {
        saveForm();
        setShowConfirmDialog(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Test: ${assessment.title}`} />
            <div className="mx-auto py-8" style={{ width: '80%' }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Edit Psychometric Test</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <Input 
                                placeholder="Test Title" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                className="mb-4" 
                            />
                            <Textarea
                                placeholder="Test Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mb-4"
                            />
                        </div>
                        <div className="mb-6 flex gap-4">
                            <Select value={selectedTestType} onValueChange={setSelectedTestType}>
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Select Test Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {testTypes.map((type, index) => (
                                        <SelectItem key={index} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Select Test Duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    {durations.map((duration, index) => (
                                        <SelectItem key={index} value={duration}>
                                            {duration}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mb-6 flex items-center gap-2">
                            <Info className="h-4 w-4 text-blue-500" />
                            <span className="text-muted-foreground text-sm">
                                The question field is optional. You can leave it empty if you only want to display answer choices.
                            </span>
                        </div>

                        {questions.map((q, qIndex) => (
                            <div key={q.id || qIndex} className="mb-6 border-b pb-4">
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
                                        <Input
                                            placeholder={`Option ${oIndex + 1}`}
                                            value={option}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                        />
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
                        <Button onClick={handleSubmit}>Save Changes</Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Update</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to save these changes? This action will update the test in the database.
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
}
