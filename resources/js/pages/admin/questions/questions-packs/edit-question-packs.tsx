// src/pages/dashboard/questions/edit-question-packs.tsx

import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import ConfirmationDialog from '@/components/confirmation-dialog';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Test & Assessment', href: '#' },
  { title: 'Question Packs', href: '/dashboard/questionpacks' },
  { title: 'Edit Question Pack', href: '#' },
];

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
}

interface Props {
  questionPack: QuestionPack;
  allQuestions?: Question[];
}

export default function EditQuestionPacks({ questionPack, allQuestions = [] }: Props) {
  const [packName, setPackName] = useState(questionPack.pack_name);
  const [description, setDescription] = useState(questionPack.description);
  const [testType, setTestType] = useState(questionPack.test_type);
  
  // Parse duration from minutes to hours, minutes, seconds
  const [duration, setDuration] = useState(() => {
    const totalMinutes = questionPack.duration;
    const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const minutes = (totalMinutes % 60).toString().padStart(2, '0');
    return { hours, minutes, seconds: '00' };
  });
  
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>(
    questionPack.questions.map(q => q.id)
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Check for changes
  useEffect(() => {
    const originalQuestionIds = questionPack.questions.map(q => q.id).sort();
    const currentQuestionIds = [...selectedQuestionIds].sort();
    
    const durationChanged = 
      parseInt(duration.hours) * 60 + parseInt(duration.minutes) !== questionPack.duration;
    
    const questionsChanged = 
      originalQuestionIds.length !== currentQuestionIds.length ||
      originalQuestionIds.some((id, index) => id !== currentQuestionIds[index]);
    
    setHasChanges(
      packName !== questionPack.pack_name ||
      description !== questionPack.description ||
      testType !== questionPack.test_type ||
      durationChanged ||
      questionsChanged
    );
  }, [packName, description, testType, duration, selectedQuestionIds, questionPack]);

  const handleSave = () => {
    setShowConfirmDialog(true);
  };

  const confirmSave = () => {
    setIsSubmitting(true);
    setShowConfirmDialog(false);
    
    const durationInMinutes = 
      parseInt(duration.hours || '0') * 60 + 
      parseInt(duration.minutes || '0');

    router.put(`/dashboard/questionpacks/${questionPack.id}`, {
      pack_name: packName,
      description,
      test_type: testType,
      duration: durationInMinutes,
      question_ids: selectedQuestionIds,
    }, {
      onFinish: () => setIsSubmitting(false)
    });
  };

  const toggleQuestionSelection = (questionId: number) => {
    setSelectedQuestionIds(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Question Pack" />
      <div className="flex flex-col p-6 gap-6">
        <Card className="w-full">
          <CardContent className="flex flex-col gap-6 p-6">
            <h2 className="text-xl font-semibold">Edit Question Pack</h2>

            <div className="space-y-2">
              <Label htmlFor="packName" className="text-blue-500">Pack Name</Label>
              <Input
                id="packName"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-500">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testType" className="text-blue-500">Test Type</Label>
                <Select value={testType} onValueChange={(value) => setTestType(value)}>
                  <SelectTrigger id="testType">
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Logic">Logic</SelectItem>
                    <SelectItem value="Emotional">Emotional</SelectItem>
                    <SelectItem value="Personality">Personality</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-blue-500">
                  Test Duration
                </Label>
                <div className="flex items-center gap-2 border rounded-lg px-4 py-2 w-full">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    className="w-10 text-center text-gray-500 outline-none bg-transparent"
                    value={duration.hours}
                    onChange={(e) =>
                      setDuration((prev) => ({ ...prev, hours: e.target.value }))
                    }
                  />
                  <span className="text-gray-400">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    className="w-10 text-center text-gray-500 outline-none bg-transparent"
                    value={duration.minutes}
                    onChange={(e) =>
                      setDuration((prev) => ({ ...prev, minutes: e.target.value }))
                    }
                  />
                  <span className="text-gray-400">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    className="w-10 text-center text-gray-500 outline-none bg-transparent"
                    value={duration.seconds}
                    onChange={(e) =>
                      setDuration((prev) => ({ ...prev, seconds: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            {allQuestions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-blue-500">Manage Questions</Label>
                <ScrollArea className="h-64 border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead className="w-[150px]">Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allQuestions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedQuestionIds.includes(question.id)}
                              onCheckedChange={() => toggleQuestionSelection(question.id)}
                            />
                          </TableCell>
                          <TableCell>{question.question_text}</TableCell>
                          <TableCell>{question.question_type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <div className="text-sm text-gray-500">
                  Selected {selectedQuestionIds.length} of {allQuestions.length} questions
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between p-6 pt-0">
            <Button
              variant="outline"
              onClick={() => router.visit('/dashboard/questionpacks')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-500 text-white hover:bg-blue-600"
              disabled={isSubmitting || !packName || !hasChanges}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Save Confirmation Dialog */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Save Changes"
        description="Are you sure you want to save these changes to the question pack?"
        confirmLabel="Save"
        cancelLabel="Cancel"
        onConfirm={confirmSave}
      />
    </AppLayout>
  );
}
