import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Edit, ArrowLeft, List } from 'lucide-react';
import { useState } from 'react';
import ConfirmationDialog from '@/components/confirmation-dialog';
import { type BreadcrumbItem } from '@/types';

interface Question {
  id: number;
  question_text: string;
  question_type: string;
}

interface QuestionPack {
  id: number;
  pack_name: string;
  description: string;
  test_type: string;
  duration: number;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

interface Props {
  questionPack: QuestionPack;
}

export default function ViewQuestionPack({ questionPack }: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Test & Assessment', href: '#' },
    { title: 'Question Packs', href: '/dashboard/questionpacks' },
    { title: questionPack.pack_name, href: `/dashboard/questionpacks/${questionPack.id}` },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (minutes: number): string => {
    // If duration is 0 or not provided, return a default message
    if (!minutes) return '60 Minutes (Default)';

    if (minutes < 60) {
      return `${minutes} Minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours} Hours ${remainingMinutes} Minutes` : `${hours} Hours`;
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    router.delete(`/dashboard/questionpacks/${questionPack.id}`, {
      onSuccess: () => router.visit('/dashboard/questionpacks')
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Question Pack: ${questionPack.pack_name}`} />
      <div className="flex flex-col p-6 gap-6">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => router.visit('/dashboard/questionpacks')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Question Packs
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => router.visit(`/dashboard/questionpacks/${questionPack.id}/edit`)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{questionPack.pack_name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Test Type</p>
                <p className="font-medium">{questionPack.test_type}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {formatDuration(questionPack.duration)}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">{formatDate(questionPack.created_at)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{formatDate(questionPack.updated_at)}</p>
              </div>
              
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p>{questionPack.description || 'No description provided.'}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <List className="h-5 w-5 text-gray-500" />
                  Questions ({questionPack.questions.length})
                </h3>
              </div>
              
              <ScrollArea className="h-96 border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead className="w-[150px]">Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionPack.questions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                          No questions have been added to this pack.
                        </TableCell>
                      </TableRow>
                    ) : (
                      questionPack.questions.map((question, index) => (
                        <TableRow key={question.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{question.question_text}</TableCell>
                          <TableCell>{question.question_type}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Question Pack"
        description={`Are you sure you want to delete "${questionPack.pack_name}"? This action cannot be undone and will remove all questions associated with this pack.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        confirmVariant="destructive"
      />
    </AppLayout>
  );
}
