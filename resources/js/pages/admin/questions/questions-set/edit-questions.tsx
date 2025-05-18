import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Test & Assessment', href: '#' },
  { title: 'Edit Test', href: '/dashboard/questions/edit-questions' },
];

interface QuestionItem {
  id?: number;
  question_text: string;
  options: string[];
}

interface Assessment {
  id: number;
  title: string;
  description: string;
  test_type: string;
  duration: string;
  questions: QuestionItem[];
}

interface Props {
  assessment: Assessment;
}

export default function EditQuestionsPage({ assessment }: Props) {
  const [questions, setQuestions] = useState<QuestionItem[]>(assessment.questions);

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].question_text = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const handleSave = () => {
    router.put(`/dashboard/questions/question-set/${assessment.id}`, {
      title: assessment.title,
      description: assessment.description,
      test_type: assessment.test_type,
      duration: assessment.duration,
      questions: JSON.stringify(questions),
    }, {
      onSuccess: () => {
        router.visit('/dashboard/questions/question-set');
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Test" />
      <div className="flex flex-1 flex-col gap-6 rounded-xl p-4">
        <Card className="p-6">
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-6 border-b pb-6">
              <h4 className="mb-2 text-base font-semibold text-gray-800">Question {qIndex + 1}</h4>

              <div className="relative mb-4">
                <label className="absolute top-2 left-3 text-sm text-blue-500">Question</label>
                <input
                  type="text"
                  value={question.question_text}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  placeholder="Enter question"
                  className="w-full rounded-md border border-blue-300 px-3 pt-6 pb-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <label className="mb-2 block text-sm text-gray-600">Answer Choices:</label>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="relative mb-2">
                  <label className="absolute top-2 left-3 text-sm text-blue-500">Option {oIndex + 1}</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                    placeholder="Enter answer"
                    className="w-full rounded-md border border-blue-300 px-3 pt-6 pb-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => addOption(qIndex)}
                className="mt-2 text-blue-500 border-blue-300"
              >
                + Add Option
              </Button>
            </div>
          ))}

          <div className="mt-6 flex justify-end">
            <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
