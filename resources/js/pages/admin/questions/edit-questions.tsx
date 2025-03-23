import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Question {
    id: number;
    question: string;
    options: string[];
    test_type: string;
    duration: string;
}

interface EditQuestionProps {
    testType: string;
    duration: string;
    questions: Question[];
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
        title: 'Edit Questions',
        href: '#',
    },
];

const durations = ['10 Menit', '20 Menit', '30 Menit', '40 Menit'];

const EditQuestionPanel = ({ testType, duration, questions }: EditQuestionProps) => {
    const [editableQuestions, setEditableQuestions] = useState<
        Array<{
            id?: number;
            question: string;
            options: string[];
            correctAnswer?: string;
        }>
    >([]);
    const [selectedTestType, setSelectedTestType] = useState(testType);
    const [selectedDuration, setSelectedDuration] = useState(duration);

    // Initialize editable questions from props
    useEffect(() => {
        if (questions && questions.length) {
            setEditableQuestions(
                questions.map((q) => ({
                    id: q.id,
                    question: q.question,
                    options: q.options || [''],
                    correctAnswer: '',
                })),
            );
        }
    }, [questions]);

    const handleAddQuestion = () => {
        setEditableQuestions([...editableQuestions, { question: '', options: [''], correctAnswer: '' }]);
    };

    const handleRemoveQuestion = (index: number) => {
        const newQuestions = editableQuestions.filter((_, i) => i !== index);
        setEditableQuestions(newQuestions);
    };

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...editableQuestions];
        newQuestions[index].question = value;
        setEditableQuestions(newQuestions);
    };

    const handleAddOption = (qIndex: number) => {
        const newQuestions = [...editableQuestions];
        newQuestions[qIndex].options.push('');
        setEditableQuestions(newQuestions);
    };

    const handleRemoveOption = (qIndex: number, oIndex: number) => {
        const newQuestions = [...editableQuestions];
        newQuestions[qIndex].options.splice(oIndex, 1);
        setEditableQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...editableQuestions];
        newQuestions[qIndex].options[oIndex] = value;
        setEditableQuestions(newQuestions);
    };

    const handleSubmit = () => {
        // Validate required fields
        if (!selectedTestType || !selectedDuration) {
            alert('Please select test type and duration');
            return;
        }

        // Validate that all options are filled
        const hasEmptyOptions = editableQuestions.some((q) => q.options.some((opt) => opt.trim() === ''));

        if (hasEmptyOptions) {
            alert('Please fill all options');
            return;
        }

        // Submit the updated form data
        router.put(`/dashboard/questions/${testType}`, {
            testType: selectedTestType,
            duration: selectedDuration,
            questions: editableQuestions,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto py-8" style={{ width: '80%' }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Edit Soal Psikotes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 flex gap-4">
                            <Input
                                value={selectedTestType}
                                onChange={(e) => setSelectedTestType(e.target.value)}
                                className="w-1/2"
                                placeholder="Test Type"
                            />
                            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Pilih Durasi Tes" />
                                </SelectTrigger>
                                <SelectContent>
                                    {durations.map((dur, index) => (
                                        <SelectItem key={index} value={dur}>
                                            {dur}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {editableQuestions.map((q, qIndex) => (
                            <div key={qIndex} className="mb-6 border-b pb-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Soal {qIndex + 1}</h3>
                                    <Button variant="ghost" size="sm" onClick={() => handleRemoveQuestion(qIndex)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    placeholder="Masukkan pertanyaan"
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                    className="mb-4"
                                />
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="mb-2 flex items-center gap-2">
                                        <Input
                                            placeholder={`Pilihan ${oIndex + 1}`}
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
                                    <Plus className="h-4 w-4" /> Tambah Pilihan
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={handleAddQuestion} className="gap-1">
                            <Plus className="h-4 w-4" /> Tambah Soal
                        </Button>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button onClick={handleSubmit}>Simpan Perubahan</Button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
};

export default EditQuestionPanel;
