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

    // Removed unused handleTimeChange function

    const handleDirectInput = (field: 'hours' | 'minutes' | 'seconds', value: string) => {
        // Allow only numeric characters
        const numericValue = value.replace(/\D/g, '');

        // Update the state directly without formatting
        if (field === 'hours') {
            setHours(numericValue);
        } else if (field === 'minutes') {
            setMinutes(numericValue);
        } else if (field === 'seconds') {
            setSeconds(numericValue);
        }
    };

    const handleBlur = (field: 'hours' | 'minutes' | 'seconds', value: string) => {
        // Parse the value and apply limits
        let numValue = parseInt(value) || 0;
        const maxValue = field === 'hours' ? 99 : 59;
        numValue = Math.min(Math.max(numValue, 0), maxValue);

        // Format with leading zeros
        const formattedValue = numValue.toString().padStart(2, '0');

        // Update the state with the formatted value
        if (field === 'hours') {
            setHours(formattedValue);
        } else if (field === 'minutes') {
            setMinutes(formattedValue);
        } else if (field === 'seconds') {
            setSeconds(formattedValue);
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
                                    <div className="flex flex-col">
                                        <Input
                                            value={hours}
                                            onChange={(e) => handleDirectInput('hours', e.target.value)}
                                            onBlur={(e) => handleBlur('hours', e.target.value)}
                                            onFocus={(e) => e.target.select()}
                                            className="w-16 text-center"
                                            placeholder="00"
                                            type="text"
                                        />
                                        <span className="mt-1 text-xs text-center text-gray-500">Hours</span>
                                    </div>
                                    <span className="mx-2 text-xl font-bold">:</span>
                                    <div className="flex flex-col">
                                        <Input
                                            value={minutes}
                                            onChange={(e) => handleDirectInput('minutes', e.target.value)}
                                            onBlur={(e) => handleBlur('minutes', e.target.value)}
                                            onFocus={(e) => e.target.select()}
                                            className="w-16 text-center"
                                            placeholder="00"
                                            type="text"
                                        />
                                        <span className="mt-1 text-xs text-center text-gray-500">Minutes</span>
                                    </div>
                                    <span className="mx-2 text-xl font-bold">:</span>
                                    <div className="flex flex-col">
                                        <Input
                                            value={seconds}
                                            onChange={(e) => handleDirectInput('seconds', e.target.value)}
                                            onBlur={(e) => handleBlur('seconds', e.target.value)}
                                            onFocus={(e) => e.target.select()}
                                            className="w-16 text-center"
                                            placeholder="00"
                                            type="text"
                                        />
                                        <span className="mt-1 text-xs text-center text-gray-500">Seconds</span>
                                    </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Total duration: {hours !== '00' ? `${hours} hours` : ''} 
                                    {minutes !== '00' ? ` ${minutes} minutes` : ''} 
                                    {seconds !== '00' ? ` ${seconds} seconds` : ''}
                                    {hours === '00' && minutes === '00' && seconds === '00' ? '60 minutes (default)' : ''}
                                </p>
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
