import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

export interface Question {
  id: number;
  question_text: string;
  question_type: string;
}

interface QuestionPackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  questions: Question[];
  selectedIds: number[];
  onSelectedChange: (ids: number[]) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function QuestionPackDialog({
  open,
  onOpenChange,
  title,
  description,
  questions,
  selectedIds,
  onSelectedChange,
  onConfirm,
  isLoading = false
}: QuestionPackDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredQuestions = searchQuery.trim()
    ? questions.filter(q => 
        q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.question_type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : questions;
    
  const toggleQuestion = (questionId: number) => {
    const newSelected = selectedIds.includes(questionId)
      ? selectedIds.filter(id => id !== questionId)
      : [...selectedIds, questionId];
    
    onSelectedChange(newSelected);
  };
  
  const toggleAll = () => {
    if (filteredQuestions.every(q => selectedIds.includes(q.id))) {
      // If all filtered questions are selected, unselect them
      const filteredIds = filteredQuestions.map(q => q.id);
      onSelectedChange(selectedIds.filter(id => !filteredIds.includes(id)));
    } else {
      // Otherwise select all filtered questions
      const newSelectedIds = [...selectedIds];
      filteredQuestions.forEach(q => {
        if (!newSelectedIds.includes(q.id)) {
          newSelectedIds.push(q.id);
        }
      });
      onSelectedChange(newSelectedIds);
    }
  };
  
  const areAllFilteredSelected = 
    filteredQuestions.length > 0 && 
    filteredQuestions.every(q => selectedIds.includes(q.id));
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Search questions..."
            className="max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
          <div className="text-sm text-gray-500">
            Selected {selectedIds.length} of {questions.length}
          </div>
        </div>
        
        <ScrollArea className="flex-1 border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={areAllFilteredSelected}
                    onCheckedChange={() => toggleAll()}
                    disabled={isLoading || filteredQuestions.length === 0}
                  />
                </TableHead>
                <TableHead>Question</TableHead>
                <TableHead className="w-[150px]">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center">
                    {searchQuery.trim() ? 'No questions found matching your search.' : 'No questions available.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuestions.map(question => (
                  <TableRow key={question.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(question.id)}
                        onCheckedChange={() => toggleQuestion(question.id)}
                        disabled={isLoading}
                      />
                    </TableCell>
                    <TableCell>{question.question_text}</TableCell>
                    <TableCell>{question.question_type}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        
        <DialogFooter className="pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isLoading || selectedIds.length === 0}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Processing...
              </>
            ) : (
              `Add ${selectedIds.length} Questions`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
