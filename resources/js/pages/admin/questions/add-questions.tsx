import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash, Info, Save } from "lucide-react";
import { type BreadcrumbItem } from '@/types';
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
        title: 'Add Question',
        href: '/dashboard/add-questions',
    },
];

const testTypes = ["Logic", "Numeric", "Verbal"];
const durations = ["10 Minutes", "20 Minutes", "30 Minutes", "40 Minutes"];

const AddQuestionPanel = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([
        { question: "", options: [""], correctAnswer: "" }
    ]);
    const [selectedTestType, setSelectedTestType] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showNavigationWarning, setShowNavigationWarning] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState("");

    // Track form changes
    useEffect(() => {
        const handleFormChange = () => setIsFormDirty(true);

        if (title || description || selectedTestType || selectedDuration ||
            questions.some(q => q.question || q.options.some(o => o))) {
            handleFormChange();
        }
    }, [title, description, selectedTestType, selectedDuration, questions]);

    // Handle browser navigation events
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isFormDirty) {
                e.preventDefault();
                e.returnValue = "";
                return "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isFormDirty]);

    // Intercept Inertia navigation
    useEffect(() => {
        const handleInertiaBeforeNavigate = (event: CustomEvent<{visit: {url: string, completed: boolean}}>) => {
            if (isFormDirty && !event.detail.visit.completed) {
                event.preventDefault();
                setPendingNavigation(event.detail.visit.url);
                setShowNavigationWarning(true);
            }
        };

        document.addEventListener("inertia:before", handleInertiaBeforeNavigate as EventListener);
        return () => document.removeEventListener("inertia:before", handleInertiaBeforeNavigate as EventListener);
    }, [isFormDirty]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", options: [""], correctAnswer: "" }]);
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
        newQuestions[qIndex].options.push("");
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
        setPendingNavigation("");
        setShowNavigationWarning(false);
    };

    const saveForm = () => {
        console.log('Saving form data', {
            title,
            description,
            testType: selectedTestType,
            duration: selectedDuration,
            questions
        });

        router.post('/dashboard/questions', {
            title,
            description,
            testType: selectedTestType,
            duration: selectedDuration,
            questions: questions.filter(q =>
                q.options.some(opt => opt.trim() !== "")
            ),
        });

        setIsFormDirty(false);
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
            <Head title="Add Questions" />
            <div className="mx-auto py-8" style={{ width: '80%' }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Add Psychometric Test</CardTitle>
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
                        <div className="flex gap-4 mb-6">
                            <Select onValueChange={setSelectedTestType}>
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Select Test Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {testTypes.map((type, index) => (
                                        <SelectItem key={index} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setSelectedDuration}>
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Select Test Duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    {durations.map((duration, index) => (
                                        <SelectItem key={index} value={duration}>{duration}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            <Info className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-muted-foreground">
                                The question field is optional. You can leave it empty if you only want to display answer choices.
                            </span>
                        </div>

                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="mb-6 border-b pb-4">
                                <div className="flex justify-between items-center mb-4">
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
                                    <div key={oIndex} className="flex items-center gap-2 mb-2">
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
                        <Button onClick={handleSubmit}>Save Questions</Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Submission</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to save these questions? This action will add them to the test database.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
                        <Button onClick={confirmSubmit}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Navigation Warning Dialog */}
            <AlertDialog open={showNavigationWarning} onOpenChange={setShowNavigationWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have unsaved changes. Would you like to save them before navigating away?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelNavigation}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.visit(pendingNavigation)}>
                            Discard
                        </AlertDialogAction>
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