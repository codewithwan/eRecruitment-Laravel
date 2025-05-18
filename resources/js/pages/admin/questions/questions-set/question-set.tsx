import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchBar } from '@/components/searchbar';
import AppLayout from '@/layouts/app-layout';
import QuestionTable, { type Question } from '@/components/question-table';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Question Set', href: '/dashboard/questions/question-set' },
];

interface Props {
  questions: {
    data: Question[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export default function QuestionSet({ questions }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    window.location.href = `/dashboard/questions/question-set?page=${page}`;
  };

  const handlePerPageChange = (perPage: number) => {
    setIsLoading(true);
    window.location.href = `/dashboard/questions/question-set?per_page=${perPage}`;
  };

  const handleView = (id: number) => console.log(`View question with ID: ${id}`);

  const handleEdit = (id: number) => {
    window.location.href = `/dashboard/questions/questions-set/edit-questions/${id}`;
  };

  const handleDelete = (id: number) => console.log(`Delete question with ID: ${id}`);

  const filteredQuestions = (questions?.data || []).filter((q) =>
    q.question_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const effectivePagination = {
    total: filteredQuestions.length,
    per_page: questions?.per_page ?? 10,
    current_page: questions?.current_page ?? 1,
    last_page: questions?.last_page ?? 1,
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Question Set" />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Question Set</h2>
          <Link href="/dashboard/questions/questions-set/add-questions">
            <Button className="rounded-md bg-blue-500 px-6 py-2 text-white hover:bg-blue-600">
              + Add Question
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <CardTitle>Question List</CardTitle>
              <CardDescription>Manage all questions in the system</CardDescription>
            </div>

            <SearchBar
              icon={<Search className="h-4 w-4" />}
              placeholder="Search question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64"
            />
          </CardHeader>

          <CardContent>
            <QuestionTable
              questions={filteredQuestions}
              pagination={effectivePagination}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
