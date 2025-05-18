import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Test & Assessment', href: '#' },
  { title: 'Question Packs', href: '/dashboard/questions/question-packs' },
];

interface QuestionPack {
  id: number;
  title: string;
  description: string;
  duration: string;
  questions_count: number;
  test_type: string;
}

export default function QuestionPacks() {
  // Dummy data
  const tests: QuestionPack[] = [
    {
      id: 1,
      title: 'Logic Test A',
      description: 'A basic logic assessment to test analytical skills.',
      duration: '30:00',
      questions_count: 15,
      test_type: 'Logic',
    },
    {
      id: 2,
      title: 'Emotional  Test',
      description: 'Assess your emotional awareness and control.',
      duration: '45:00',
      questions_count: 20,
      test_type: 'Emotional',
    },
    {
      id: 3,
      title: 'Personality Profiler',
      description: 'Discover your personality traits.',
      duration: '25:00',
      questions_count: 10,
      test_type: 'Personality',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Question Packs" />
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Question Packs</h2>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 text-sm px-4 py-2"
            onClick={() => router.visit('/dashboard/questions/question-packs/add')}
          >
            + Add Package
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((pack, index) => (
            <Card
              key={pack.id}
              className="rounded-lg border border-gray-200 shadow-sm"
            >
              <CardContent className="px-4 py-0 space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`flex items-center rounded px-2 py-0.5 text-xs font-semibold text-white ${getBadgeColor(
                      pack.test_type
                    )}`}
                  >
                    <Mail className="mr-1 h-3 w-3" />
                    Package {String.fromCharCode(65 + index)}
                  </span>
                  <h3 className="text-sm font-bold">{pack.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{pack.description}</p>
                <div className="text-sm text-gray-700 flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{pack.duration} Minutes</span>
                  <span className="text-gray-400">|</span>
                  <span>{pack.questions_count} Questions</span>
                </div>
                <p className="text-sm text-gray-700">Type: {pack.test_type}</p>
                <div className="flex justify-end gap-4 pt-2 text-sm">
                  <Button variant="link" className="text-blue-500 p-0 h-auto">
                    View
                  </Button>
                  <Button
                    variant="link"
                    className="text-blue-500 p-0 h-auto"
                    onClick={() =>
                      router.visit(`/dashboard/questions/question-packs/${pack.id}/edit`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="link"
                    className="text-red-500 p-0 h-auto"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this question pack?')) {
                        console.log(`Deleted dummy pack with ID: ${pack.id}`);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

function getBadgeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'logic':
      return 'bg-blue-500';
    case 'emotional':
      return 'bg-yellow-500';
    case 'personality':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}
