import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Question {
  id: number;
  question_text: string;
  correct_answer: string;
  question_type: string;
  created_at: string;
  updated_at: string;
}

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface QuestionTableProps {
  questions: Question[];
  pagination: PaginationData;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  itemsPerPageOptions?: number[];
  isLoading?: boolean;
}

export default function QuestionTable({
  questions,
  pagination,
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onPageChange,
  onPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 50],
  isLoading = false,
}: QuestionTableProps) {
  const handleNextPage = () => {
    if (pagination.current_page < pagination.last_page) {
      onPageChange(pagination.current_page + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.current_page > 1) {
      onPageChange(pagination.current_page - 1);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    onPerPageChange(Number(value));
  };

  const paginatedQuestions = questions.slice(
    (pagination.current_page - 1) * pagination.per_page,
    pagination.current_page * pagination.per_page
  );

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <Table className="min-w-full bg-blue-50 [&_tr:hover]:bg-transparent">
          <TableHeader className="bg-blue-50 [&_tr:hover]:bg-transparent">
            <TableRow className="hover:bg-transparent [&>th]:hover:bg-transparent">
              <TableHead className="w-[60px] py-3">ID</TableHead>
              <TableHead className="py-3">Pertanyaan</TableHead>
              <TableHead className="py-3">Jawaban Benar</TableHead>
              <TableHead className="py-3">Tipe Soal</TableHead>
              <TableHead className="w-[140px] py-3 text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: pagination.per_page }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : paginatedQuestions.length > 0 ? (
                  paginatedQuestions.map((question, idx) => (
                    <TableRow key={question.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                      <TableCell>{String(question.id).padStart(2, '0')}</TableCell>
                      <TableCell className="whitespace-normal break-words max-w-xs">{question.question_text}</TableCell>
                      <TableCell>{question.correct_answer}</TableCell>
                      <TableCell>{question.question_type}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => onView(question.id)}
                            className="rounded-full p-1.5 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => onEdit(question.id)}
                            className="rounded-full p-1.5 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          >
                            <Pencil className="h-4.5 w-4.5" />
                          </button>
                          <button
                            onClick={() => onDelete(question.id)}
                            className="rounded-full p-1.5 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-4 text-center text-gray-500">
                      Tidak ada soal ditemukan.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Tampilkan</span>
          <Select
            value={(pagination?.per_page ?? 10).toString()}
            onValueChange={handleItemsPerPageChange}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-16 rounded border border-blue-300 text-blue-300">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent className="border border-blue-500">
              {itemsPerPageOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={option.toString()}
                  className="text-blue-300 hover:bg-blue-50 focus:bg-blue-50 focus:text-blue-500"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">per halaman</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevPage}
            disabled={pagination.current_page === 1 || isLoading}
            className="flex items-center justify-center rounded-md border border-blue-500 px-2 py-1 text-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: pagination.last_page }).map((_, i) => {
            const page = i + 1;
            const isActive = page === pagination.current_page;
            const isVisible =
              page === 1 || page === pagination.last_page || isActive || Math.abs(page - pagination.current_page) <= 1;

            return (
              <button
                key={i}
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                className={`flex h-8 min-w-[32px] items-center justify-center rounded-md px-2 ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'border border-blue-500 bg-white text-blue-500 hover:bg-blue-100'
                } ${!isVisible ? 'hidden sm:flex' : ''}`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={handleNextPage}
            disabled={pagination.current_page === pagination.last_page || isLoading}
            className="flex items-center justify-center rounded-md border border-blue-500 px-2 py-1 text-blue-500 hover:bg-blue-100 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="text-center text-sm text-gray-500 sm:text-right">
          Menampilkan {(pagination.current_page - 1) * pagination.per_page + 1} hingga{' '}
          {Math.min(pagination.current_page * pagination.per_page, pagination.total)} dari {pagination.total} soal
        </div>
      </div>
    </div>
  );
}
