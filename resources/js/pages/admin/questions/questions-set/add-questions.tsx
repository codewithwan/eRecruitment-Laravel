import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Test & Assessment', href: '#' },
  { title: 'Question Sets', href: '/dashboard/questions/questions-set' },
  { title: 'Add Questions', href: '#' },
];

interface QuestionItem {
  question_text: string;
  options: string[];
  correct_answer: string;
}

interface Props {
  questionPack?: {
    id: number;
    pack_name: string;
  } | null;
}

export default function AddQuestionsPage({ questionPack }: Props) {
  const [questions, setQuestions] = useState<QuestionItem[]>([
    { question_text: '', options: ['', ''], correct_answer: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].question_text = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    
    // If this option was the correct answer, update it with the new value
    if (updated[qIndex].correct_answer === questions[qIndex].options[oIndex]) {
      updated[qIndex].correct_answer = value;
    }
    
    setQuestions(updated);
  };

  const setCorrectAnswer = (qIndex: number, option: string) => {
    const updated = [...questions];
    updated[qIndex].correct_answer = option;
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    if (questions[qIndex].options.length <= 2) {
      alert('At least 2 options are required');
      return;
    }

    const updated = [...questions];
    
    // If we're removing the correct answer, reset it
    if (updated[qIndex].correct_answer === updated[qIndex].options[oIndex]) {
      updated[qIndex].correct_answer = updated[qIndex].options[0];
    }
    
    updated[qIndex].options.splice(oIndex, 1);
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question_text: '', options: ['', ''], correct_answer: '' }]);
  };

  const removeQuestion = (qIndex: number) => {
    if (questions.length <= 1) {
      alert('At least one question is required');
      return;
    }
    const updated = [...questions];
    updated.splice(qIndex, 1);
    setQuestions(updated);
  };

  const validateQuestions = () => {
    // Check each question has text
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question_text.trim()) {
        alert(`Question ${i + 1} has no text`);
        return false;
      }
      
      // Check all options have text
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          alert(`Option ${j + 1} in Question ${i + 1} has no text`);
          return false;
        }
      }
      
      // Check a correct answer is selected
      if (!questions[i].correct_answer) {
        alert(`No correct answer selected for Question ${i + 1}`);
        return false;
      }
    }
    
    return true;
  };

  const handleSave = () => {
    if (!validateQuestions()) {
      return;
    }

    setIsSubmitting(true);

    const payload: any = {
      questions: questions
    };
    
    // If we have a question pack, include its ID
    if (questionPack) {
      payload.question_pack_id = questionPack.id;
    }

    router.post('/dashboard/questions/questions-set', payload, {
      onSuccess: () => {
        router.visit('/dashboard/questions/questions-set');
      },
      onError: (errors) => {
        console.error('Error saving questions:', errors);
        setIsSubmitting(false);
        alert('Failed to save questions. Please check your input and try again.');
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Questions" />
      <div className="flex flex-col p-6 gap-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.visit('/dashboard/questions/questions-set')}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Question Sets
          </Button>
          
          {questionPack && (
            <div className="text-gray-700">
              Adding questions to pack: <span className="font-medium">{questionPack.pack_name}</span>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="p-4 border rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Question {qIndex + 1}</h3>
                  {questions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-500"
                    >
                      Remove Question
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                    <textarea
                      value={question.question_text}
                      onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                      placeholder="Enter question text"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                    <p className="text-xs text-gray-500 mb-2">Select the radio button next to the correct answer</p>
                    
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3 mb-2">
                        <input
                          type="radio"
                          name={`correct-answer-${qIndex}`}
                          checked={option === question.correct_answer}
                          onChange={() => setCorrectAnswer(qIndex, option)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {question.options.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="text-red-500 h-8 w-8 p-0"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(qIndex)}
                      className="mt-2"
                    >
                      + Add Option
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={addQuestion}
              className="w-full border-dashed"
            >
              + Add Another Question
            </Button>
            
            <div className="flex justify-end pt-4">
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Questions'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
