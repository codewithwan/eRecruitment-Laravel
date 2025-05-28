import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { Loader2, Search, ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Test & Assessment', href: '#' },
  { title: 'Question Packs', href: '/dashboard/questionpacks' },
  { title: 'Add Question Pack', href: '/dashboard/questionpacks/create' },
];

interface Question {
  id: number;
  question_text: string;
  question_type: string;
}

interface Props {
  questions?: Question[];
}

export default function AddQuestionPacks({ questions = [] }: Props) {
  const [packName, setPackName] = useState('');
  const [description, setDescription] = useState('');
  const [testType, setTestType] = useState('');
  const [duration, setDuration] = useState({ hours: '00', minutes: '60', seconds: '00' });
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(questions);

  // Filter questions based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredQuestions(
        questions.filter(
          (q) =>
            q.question_text.toLowerCase().includes(lowerCaseQuery) ||
            q.question_type.toLowerCase().includes(lowerCaseQuery)
        )
      );
    } else {
      setFilteredQuestions(questions);
    }
  }, [questions, searchQuery]);

  // Format duration to HH:MM:SS
  const formatDuration = () => {
    return `${duration.hours.padStart(2, '0')}:${duration.minutes.padStart(2, '0')}:${duration.seconds.padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Submit all question pack data at once
    router.post('/dashboard/questionpacks', {
      pack_name: packName,
      description,
      test_type: testType,
      duration: formatDuration(),
      question_ids: selectedQuestions,
    }, {
      onFinish: () => setIsSubmitting(false)
    });
  };

  const toggleQuestionSelection = (questionId: number) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };
  
  // Function to toggle all currently filtered questions
  const toggleAll = (checked: boolean) => {
    if (checked) {
      const newIds = [...selectedQuestions];
      filteredQuestions.forEach(q => {
        if (!newIds.includes(q.id)) {
          newIds.push(q.id);
        }
      });
      setSelectedQuestions(newIds);
    } else {
      const filteredIds = filteredQuestions.map(q => q.id);
      setSelectedQuestions(prev => prev.filter(id => !filteredIds.includes(id)));
    }
  };
  
  const areAllSelected = 
    filteredQuestions.length > 0 &&
    filteredQuestions.every((q) => selectedQuestions.includes(q.id));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Question Pack" />
      <div className="flex flex-col p-6 gap-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create Question Pack</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">

            <div className="space-y-2">
              <Label htmlFor="packName" className="text-blue-500">
                Pack Name
              </Label>
              <Input
                id="packName"
                placeholder="Enter pack name"
                value={packName}
                onChange={(e) => setPackName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-500">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testType" className="text-blue-500">
                  Test Type
                </Label>
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
                    placeholder="00"
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
                    placeholder="00"
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
                    placeholder="00"
                    className="w-10 text-center text-gray-500 outline-none bg-transparent"
                    value={duration.seconds}
                    onChange={(e) =>
                      setDuration((prev) => ({ ...prev, seconds: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-blue-500">Select Questions</Label>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 relative w-full max-w-sm">
                  <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-8"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  Selected {selectedQuestions.length} of {questions.length} questions
                </div>
              </div>

              <ScrollArea className="h-[300px] border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={areAllSelected}
                          onCheckedChange={toggleAll}
                          disabled={filteredQuestions.length === 0}
                        />
                      </TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead className="w-[150px]">Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          {searchQuery
                            ? 'No questions matching your search'
                            : 'No questions available'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredQuestions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedQuestions.includes(question.id)}
                              onCheckedChange={() => toggleQuestionSelection(question.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{question.question_text}</TableCell>
                          <TableCell>{question.question_type}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-6 pt-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.visit('/dashboard/questionpacks')}
            >
              <ArrowLeft className="h-4 w-4" /> Back to Question Packs
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-500 text-white hover:bg-blue-600"
              disabled={isSubmitting || !packName || !description || !testType || selectedQuestions.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                `Save Question Pack (${selectedQuestions.length} Questions)`
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
