import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

interface QuestionPack {
  id: number;
  pack_name: string;
}

interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  question_type: string;
  created_at: string;
  updated_at: string;
  question_packs: QuestionPack[];
}

interface Props {
  question: Question;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Test & Assessment', href: '#' },
  { title: 'Question Sets', href: '/dashboard/questions/questions-set' },
  { title: 'View Question', href: '#' },
];

export default function ViewQuestion({ question }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleEdit = () => {
    router.visit(`/dashboard/questions/questions-set/edit-questions/${question.id}`);
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      setIsDeleting(true);
      router.delete(`/dashboard/questions/${question.id}`, {
        onSuccess: () => {
          router.visit('/dashboard/questions/questions-set');
        },
        onError: (errors) => {
          setIsDeleting(false);
          console.error('Error deleting question:', errors);
          alert('Failed to delete the question. Please try again.');
        }
      });
    }
  };
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="View Question" />
      <div className="flex flex-col p-6 gap-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.visit('/dashboard/questions/questions-set')}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Questions
          </Button>

          <div className="flex gap-2">
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600 gap-2"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" /> Edit Question
            </Button>
            <Button
              variant="outline"
              className="text-red-500 border-red-300 hover:bg-red-50 gap-2"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash className="h-4 w-4" /> {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Question Details</CardTitle>
            <CardDescription>
              Created {formatDate(question.created_at)}
              {question.updated_at !== question.created_at && 
                ` • Updated ${formatDate(question.updated_at)}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Question</h3>
              <p className="text-gray-800 text-lg">{question.question_text}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Options</h3>
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      option === question.correct_answer 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 
                        ${option === question.correct_answer ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                      {option === question.correct_answer && (
                        <span className="ml-auto text-green-600 text-sm font-medium">Correct Answer</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Question Type</h3>
              <div className="mt-1 inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm capitalize">
                {question.question_type.replace('_', ' ')}
              </div>
            </div>

            {question.question_packs && question.question_packs.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Used in Question Packs</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {question.question_packs.map(pack => (
                    <span 
                      key={pack.id}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm cursor-pointer hover:bg-blue-200"
                      onClick={() => router.visit(`/dashboard/questionpacks/${pack.id}`)}
                    >
                      {pack.pack_name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
