import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import SelectQuestionTable, { Question } from '@/components/select-questions-table';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Props {
  questions: Question[];
  tempAssessment?: {
    title: string;
    description: string;
    test_type: string;
    duration: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Test & Assessment', href: '#' },
  { title: 'Add Test', href: '/dashboard/questions/question-packs/add' },
  { title: 'Select Questions', href: '/dashboard/questions/question-packs/select-questions' },
];

export default function SelectQuestions({ questions, tempAssessment }: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectChange = (id: number, selected: boolean) => {
    setSelectedIds((prev) =>
      selected ? [...prev, id] : prev.filter((q) => q !== id)
    );
  };

  const handleAdd = () => {
    if (!tempAssessment) {
      alert('Assessment data is missing');
      return;   
    }

    setIsLoading(true);

    router.post('/dashboard/questions/question-packs/save-selected', {
      question_ids: selectedIds,
      title: tempAssessment.title,
      description: tempAssessment.description,
      test_type: tempAssessment.test_type,
      duration: tempAssessment.duration,
    }, {
      onFinish: () => setIsLoading(false),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Select Questions" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Question List</h2>
        <SelectQuestionTable
          questions={questions}
          selectedIds={selectedIds}
          onSelectChange={handleSelectChange}
          isLoading={isLoading}
        />
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleAdd}
            className="bg-blue-500 text-white"
            disabled={selectedIds.length === 0 || isLoading}
          >
            {isLoading ? 'Saving...' : 'Add'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
