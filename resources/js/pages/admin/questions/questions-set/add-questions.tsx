import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Test & Assessment', href: '#' },
  { title: 'Add Test', href: '/dashboard/questions/questions-set/add-questions' },
];

interface QuestionItem {
  question_text: string;
  options: string[];
  correct_answer: string;
}

export default function AddQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>([
    { question_text: '', options: ['', ''], correct_answer: '' },
  ]);

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

  const handleCorrectAnswerChange = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].correct_answer = value;
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', options: ['', ''], correct_answer: '' }]);
  };


  const handleSave = () => {
    const isValid = questions.every(q => q.question_text && q.correct_answer && q.options.length >= 2 && q.options.every(opt => opt));
    if (!isValid) {
      alert('Please complete all questions, options, and correct answers before saving.');
      return;
    }
  
    router.post('/dashboard/questions/question-set/store', {
      questions: questions as any,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Test" />
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
                  <label className="absolute top-2 left-3 text-sm text-blue-500">
                    Option {oIndex + 1}
                  </label>
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

              <div className="mt-4">
                <label className="text-sm text-gray-600">Correct Answer:</label>
                <input
                  type="text"
                  value={question.correct_answer}
                  onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                  placeholder="Enter correct answer"
                  className="w-full rounded-md border border-green-400 mt-1 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="mt-2 text-blue-500 border-blue-300"
            onClick={addQuestion}
          >
            + Add Question
          </Button>

          <div className="mt-6 flex justify-end">
            <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleSave}>
              Save Questions
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
