import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Search, Eye, Pencil, Trash, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  created_at: string;
  updated_at: string;
  question_packs?: { id: number; pack_name: string }[];
}

interface Props {
  questions: Question[];
}

// Import ConfirmationDialog component
import ConfirmationDialog from '@/components/confirmation-dialog';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Test & Assessment', href: '#' },
  { title: 'Question Sets', href: '/dashboard/questions/questions-set' },
];

export default function QuestionSet({ questions = [] }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterUsed, setFilterUsed] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  
  // Filter questions based on search query
  const filteredQuestions = questions.filter((q) => 
    q.question_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddQuestion = () => {
    router.visit('/dashboard/questions/questions-set/add-questions');
  };

  const handleEditQuestion = (id: number) => {
    router.visit(`/dashboard/questions/questions-set/edit-questions/${id}`);
  };

  const handleViewQuestion = (id: number) => {
    router.visit(`/dashboard/questions/questions-set/view/${id}`);
  };

  const openDeleteDialog = (id: number) => {
    setQuestionToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteQuestion = () => {
    if (!questionToDelete) return;
    
    setIsLoading(true);
    
    router.delete(`/dashboard/questions/${questionToDelete}`, {
      onSuccess: () => {
        setIsLoading(false);
        setDeleteDialogOpen(false);
        setQuestionToDelete(null);
        // Success message will be shown by the backend flash message
      },
      onError: (errors) => {
        console.error('Error deleting question:', errors);
        setIsLoading(false);
        alert('Failed to delete the question. Please try again.');
      },
    });
  };
  
  // Advanced filtering logic
  const clearFilters = () => {
    setSearchQuery('');
    setFilterUsed(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterUsed(searchQuery.trim() !== '');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Question Sets" />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        confirmLabel={isLoading ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={handleDeleteQuestion}
        onCancel={closeDeleteDialog}
        confirmVariant="destructive"
      />
      
      <div className="flex h-full flex-1 flex-col gap-6 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Question Sets</h2>
            <p className="text-gray-500 text-sm">Manage questions for assessments and tests</p>
          </div>
          <Button 
            className="bg-blue-500 hover:bg-blue-600 gap-2" 
            onClick={handleAddQuestion}
          >
            <PlusCircle className="h-4 w-4" /> Add Question
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <CardTitle>Question List</CardTitle>
              <CardDescription>
                {filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'} available
              </CardDescription>
            </div>
            
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search questions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                title="Clear filters"
                disabled={!filterUsed}
                onClick={clearFilters}
                className="h-10 w-10"
              >
                ×
              </Button>
            </form>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 bg-gray-50 p-4 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <div className="col-span-1">No</div>
                <div className="col-span-8">Question</div>
                <div className="col-span-3 text-right">Action</div>
              </div>

              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading questions...</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="p-8 text-center">
                  {filterUsed ? (
                    <>
                      <p className="text-gray-500 font-medium">No matching questions found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search query</p>
                      <Button 
                        variant="link" 
                        onClick={clearFilters} 
                        className="mt-2 text-blue-500"
                      >
                        Clear search
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 font-medium">No questions available</p>
                      <p className="text-gray-400 text-sm mt-1">Get started by creating your first question</p>
                      <Button 
                        variant="link" 
                        onClick={handleAddQuestion} 
                        className="mt-2 text-blue-500"
                      >
                        Add a question
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                filteredQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`grid grid-cols-12 border-t p-4 ${index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
                  >
                    <div className="col-span-1">{(index + 1).toString().padStart(2, '0')}</div>
                    <div className="col-span-8 truncate">{question.question_text || 'Question without text'}</div>
                    <div className="col-span-3 flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-500"
                        onClick={() => handleViewQuestion(question.id)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-500"
                        onClick={() => handleEditQuestion(question.id)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={() => openDeleteDialog(question.id)}
                        title="Delete"
                        disabled={isLoading}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
