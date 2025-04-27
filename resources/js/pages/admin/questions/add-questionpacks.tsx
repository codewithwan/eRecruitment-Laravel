'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Question {
    id: number;
    question: string;
    question_type: string;
    options?: Array<{ id: number; text: string }>;
}

interface AddQuestionPackProps {
    questions: Question[];
}

interface QuestionPackForm {
    [key: string]: string | number | number[]; // Index signature for compatibility
    pack_name: string;
    description: string;
    test_type: string;
    duration: number;
    question_ids: number[];
}

const testTypes = [
    { value: 'logic', label: 'Logic' },
    { value: 'emotional', label: 'Emotional' },
    { value: 'technical', label: 'Technical' },
    { value: 'psychological', label: 'Psychological' },
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Question Packs', href: '/dashboard/questionpacks' },
    { title: 'Add Package', href: '/dashboard/questionpacks/create' },
];

export default function AddQuestionPack({ questions = [] }: AddQuestionPackProps) {
    const [hours, setHours] = useState('00');
    const [minutes, setMinutes] = useState('00');
    const [seconds, setSeconds] = useState('00');
    const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
    const [showQuestionSelector, setShowQuestionSelector] = useState(false);

    const { data, setData, processing, errors } = useForm<QuestionPackForm>({
        pack_name: '',
        description: '',
        test_type: '',
        duration: 0,
        question_ids: [], // Initialize with an empty array
    });

    const toggleQuestionSelection = (questionId: number) => {
        // Update the selectedQuestions state
        const newSelection = selectedQuestions.includes(questionId)
            ? selectedQuestions.filter((id) => id !== questionId)
            : [...selectedQuestions, questionId];

        setSelectedQuestions(newSelection);

        // Also update the form data directly to ensure it's included in submission
        setData('question_ids', newSelection);

        console.log('Question selection updated:', newSelection);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Calculate total minutes from hours, minutes, seconds
        const hoursVal = parseInt(hours || '0', 10);
        const minutesVal = parseInt(minutes || '0', 10);
        const secondsVal = parseInt(seconds || '0', 10);

        // Calculate total minutes correctly
        const totalMinutes = hoursVal * 60 + minutesVal + (secondsVal > 0 ? 1 : 0);

        console.log(`Duration details - Hours: ${hoursVal}, Minutes: ${minutesVal}, Seconds: ${secondsVal}`);
        console.log(`Total minutes calculated: ${totalMinutes}`);

        // Use data() to explicitly create the payload with the correct duration
        const payload = {
            pack_name: data.pack_name,
            description: data.description,
            test_type: data.test_type,
            duration: totalMinutes > 0 ? totalMinutes : 60,
            question_ids: selectedQuestions,
        };

        console.log('Sending payload with duration:', payload.duration);

        // Use Inertia's router.post directly instead of the useForm hook's post method
        router.post('/dashboard/questionpacks', payload, {
            onSuccess: () => console.log('Form submitted successfully'),
            onError: (errors) => console.error('Errors:', errors),
        });
    };

    const handleTimeChange = (field: 'hours' | 'minutes' | 'seconds', value: string) => {
        let numValue = parseInt(value) || 0;
        if (field === 'hours') {
            numValue = Math.min(Math.max(numValue, 0), 99);
            setHours(numValue.toString().padStart(2, '0'));
        } else if (field === 'minutes') {
            numValue = Math.min(Math.max(numValue, 0), 59);
            setMinutes(numValue.toString().padStart(2, '0'));
        } else if (field === 'seconds') {
            numValue = Math.min(Math.max(numValue, 0), 59);
            setSeconds(numValue.toString().padStart(2, '0'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Question Pack" />
            <div className="px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-6 text-2xl font-bold">Add Package</h1>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Test Title */}
                        <div className="mb-4">
                            <Label htmlFor="test-title">Test Title</Label>
                            <Input
                                id="test-title"
                                value={data.pack_name}
                                onChange={(e) => setData('pack_name', e.target.value)}
                                placeholder="Enter test title"
                                className="mt-1 w-full"
                            />
                            {errors.pack_name && <p className="text-sm text-red-500">{errors.pack_name}</p>}
                        </div>

                        {/* Test Description */}
                        <div className="mb-4">
                            <Label htmlFor="test-description">Test Description</Label>
                            <Textarea
                                id="test-description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Enter test description"
                                className="mt-1 w-full"
                                rows={4}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        {/* Test Type and Duration */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <Label htmlFor="test-type">Test Type</Label>
                                <Select value={data.test_type} onValueChange={(value) => setData('test_type', value)}>
                                    <SelectTrigger id="test-type" className="mt-1 w-full">
                                        <SelectValue placeholder="Select test type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {testTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.test_type && <p className="text-sm text-red-500">{errors.test_type}</p>}
                            </div>

                            <div>
                                <Label>Test Duration</Label>
                                <div className="mt-1 flex items-center">
                                    <Input
                                        value={hours}
                                        onChange={(e) => handleTimeChange('hours', e.target.value)}
                                        className="w-16 text-center"
                                        maxLength={2}
                                        placeholder="00"
                                    />
                                    <span className="mx-2">:</span>
                                    <Input
                                        value={minutes}
                                        onChange={(e) => handleTimeChange('minutes', e.target.value)}
                                        className="w-16 text-center"
                                        maxLength={2}
                                        placeholder="00"
                                    />
                                    <span className="mx-2">:</span>
                                    <Input
                                        value={seconds}
                                        onChange={(e) => handleTimeChange('seconds', e.target.value)}
                                        className="w-16 text-center"
                                        maxLength={2}
                                        placeholder="00"
                                    />
                                </div>
                                {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="mb-6">
                            <div className="mb-4 flex items-center justify-between">
                                <Label>Selected Questions ({selectedQuestions.length})</Label>
                                <Button type="button" onClick={() => setShowQuestionSelector(!showQuestionSelector)}>
                                    {showQuestionSelector ? 'Hide Questions' : 'Select Questions'}
                                </Button>
                            </div>

                            {showQuestionSelector && (
                                <div className="rounded-md border bg-gray-50 p-4">
                                    <h3 className="mb-3 font-medium">Available Questions</h3>
                                    <div className="max-h-60 overflow-y-auto">
                                        {questions.length ? (
                                            questions.map((question) => (
                                                <div key={question.id} className="flex items-start space-x-2 rounded p-2 hover:bg-gray-100">
                                                    <Checkbox
                                                        id={`q-${question.id}`}
                                                        checked={selectedQuestions.includes(question.id)}
                                                        onCheckedChange={() => toggleQuestionSelection(question.id)}
                                                    />
                                                    <div>
                                                        <label htmlFor={`q-${question.id}`} className="cursor-pointer">
                                                            {question.question}
                                                        </label>
                                                        <p className="text-xs text-gray-500">ID: {question.id}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No questions available</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {selectedQuestions.length > 0 && (
                                <div className="mt-4">
                                    <Card>
                                        <CardContent className="p-4">
                                            <h4 className="mb-2 font-medium">Selected Questions:</h4>
                                            <ul className="list-disc space-y-1 pl-5">
                                                {selectedQuestions.map((qId) => {
                                                    const question = questions.find((q) => q.id === qId);
                                                    return <li key={qId}>{question?.question || `Question #${qId}`}</li>;
                                                })}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                Save Question Pack
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
