import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { type BreadcrumbItem } from '@/types';
import AppLayout from "@/layouts/app-layout";
import { router } from "@inertiajs/react";

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

const testTypes = ["Logika", "Numerik", "Verbal"];
const durations = ["10 Menit", "20 Menit", "30 Menit", "40 Menit"];

const AddQuestionPanel = () => {
    const [questions, setQuestions] = useState([
        { question: "", options: [""], correctAnswer: "" }
    ]);
    const [selectedTestType, setSelectedTestType] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");

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

    const handleSubmit = () => {
        // Add validation here to ensure required fields are filled
        if (!selectedTestType || !selectedDuration) {
            alert("Please select test type and duration");
            return;
        }

        // Validate that all options are filled
        const hasEmptyOptions = questions.some(q => 
            q.options.some(opt => opt.trim() === "")
        );

        if (hasEmptyOptions) {
            alert("Please fill all options");
            return;
        }

        // Filter out any questions with empty content - allowing empty questions
        const filteredQuestions = questions.filter(q => 
            // Keep all questions with content or with filled options
            q.question.trim() !== "" || q.options.some(opt => opt.trim() !== "")
        );
        
        if (filteredQuestions.length === 0) {
            alert("Please add at least one question or option");
            return;
        }

        // Submit the form data to the backend with filtered questions
        router.post('/dashboard/questions', {
            testType: selectedTestType,
            duration: selectedDuration,
            questions: filteredQuestions,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto py-8" style={{ width: '80%' }}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Tambah Soal Psikotes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 mb-6">
                            <Select onValueChange={setSelectedTestType}>
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Pilih Jenis Tes" />
                                </SelectTrigger>
                                <SelectContent>
                                    {testTypes.map((type, index) => (
                                        <SelectItem key={index} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setSelectedDuration}>
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Pilih Durasi Tes" />
                                </SelectTrigger>
                                <SelectContent>
                                    {durations.map((duration, index) => (
                                        <SelectItem key={index} value={duration}>{duration}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="mb-6 border-b pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Soal {qIndex + 1}</h3>
                                    {questions.length > 1 && (
                                        <Button variant="ghost" size="sm" onClick={() => handleRemoveQuestion(qIndex)}>
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <Textarea
                                    placeholder="Masukkan pertanyaan"
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                    className="mb-4"
                                />
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-2 mb-2">
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
                        <Button onClick={handleSubmit}>Simpan Soal</Button>
                    </CardFooter>
                </Card>
            </div>
        </AppLayout>
    );
};

export default AddQuestionPanel;