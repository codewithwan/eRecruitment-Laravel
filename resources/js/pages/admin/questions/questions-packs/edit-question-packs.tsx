// src/pages/dashboard/questions/edit-question-packs.tsx

import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Test & Assessment', href: '#' },
  { title: 'Edit Test', href: '/dashboard/questions/question-packs/edit' },
];

interface Question {
  id: number;
  question_text: string;
  options: string[];
}

interface Assessment {
  id: number;
  title: string;
  description: string;
  test_type: string;
  duration: string;
  questions: Question[];
}

interface Props {
  assessment: Assessment;
}

export default function EditQuestionPacks({ assessment }: Props) {
  const [title, setTitle] = useState(assessment.title);
  const [description, setDescription] = useState(assessment.description);
  const [type, setType] = useState(assessment.test_type);
  const [duration, setDuration] = useState(assessment.duration);
  const [questions, setQuestions] = useState(
    assessment.questions.map((q) => ({
      id: q.id,
      text: q.question_text,
      options: q.options,
    }))
  );

  const handleSave = () => {
    router.put(`/dashboard/questions/question-packs/${assessment.id}`, {
      title,
      description,
      test_type: type,
      duration,
      questions: questions.map((q) => ({
        text: q.text,
        options: q.options,
      })),
    }, {
      onSuccess: () => {
        router.visit('/dashboard/questions/question-packs');
      },
    });
  };

  const handleChangeQuestion = (
    index: number,
    field: 'text' | 'option',
    value: string,
    optionIndex?: number
  ) => {
    const updated = [...questions];
    if (field === 'text') {
      updated[index].text = value;
    } else if (field === 'option' && optionIndex !== undefined) {
      updated[index].options[optionIndex] = value;
    }
    setQuestions(updated);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Test" />
      <div className="flex flex-col p-6">
        <Card className="w-full p-6">
          <CardContent className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Question Pack</h2>

            <div className="space-y-2">
              <Label className="text-blue-500">Test Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label className="text-blue-500">Test Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-blue-500">Test Type</Label>
                <Select value={type} onValueChange={(value) => setType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Logic">Logic</SelectItem>
                    <SelectItem value="Emotional">Emotional</SelectItem>
                    <SelectItem value="Personality">Personality</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-blue-500">Test Duration</Label>
                <Input
                  type="text"
                  placeholder="00:30:00"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            {questions.map((q, i) => (
              <div key={q.id} className="border-t pt-4 space-y-3">
                <h3 className="font-semibold">Question {i + 1}</h3>
                <div className="space-y-2">
                  <Label className="text-blue-500">Question</Label>
                  <Input
                    value={q.text}
                    onChange={(e) => handleChangeQuestion(i, 'text', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Answer Choices:</Label>
                  {q.options.map((opt, j) => (
                    <Input
                      key={j}
                      placeholder={`Option ${j + 1}`}
                      value={opt}
                      onChange={(e) =>
                        handleChangeQuestion(i, 'option', e.target.value, j)
                      }
                    />
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-4">
              <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleSave}>
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
