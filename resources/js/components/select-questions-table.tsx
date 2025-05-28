import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye } from 'lucide-react';

export interface Question {
  id: number;
  question_text: string;
}

interface Props {
  questions: Question[];
  selectedIds: number[];
  onSelectChange: (id: number, selected: boolean) => void;
  isLoading?: boolean;
}

export default function SelectQuestionTable({
  questions,
  selectedIds,
  onSelectChange,
  isLoading = false,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-200">
      <Table className="min-w-full bg-blue-50">
        <TableHeader className="bg-blue-50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">No</TableHead>
            <TableHead>Question</TableHead>
            <TableHead className="text-right w-24">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {questions.length > 0 ? (
            questions.map((question, idx) => (
              <TableRow
                key={question.id}
                className="bg-white even:bg-blue-50 hover:bg-blue-50 transition-colors"
              >
                <TableCell className="align-middle">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(question.id)}
                    onChange={(e) => onSelectChange(question.id, e.target.checked)}
                  />
                </TableCell>

                <TableCell>{question.question_text}</TableCell>

                <TableCell className="text-right">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Eye className="h-4 w-4 inline" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                No questions available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
