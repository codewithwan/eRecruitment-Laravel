import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Clock } from 'lucide-react';
import ConfirmationDialog from '@/components/confirmation-dialog';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Test & Assessment', href: '#' },
  { title: 'Question Packs', href: '/dashboard/questionpacks' },
];

// Define the type for flash messages
interface FlashMessages {
  info?: string;
  success?: string;
}

interface QuestionPack {
  id: number;
  pack_name: string;
  description: string | null;
  test_type: string;
  duration: number;
  questions_count?: number;
  created_at: string;
  updated_at: string;
}

interface QuestionPackProps {
  questionPacks: QuestionPack[];
}

// Helper function to format test types for display
const formatTestType = (type?: string): string => {
  if (!type) return 'Unknown'; // Handle undefined or null values
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Helper function to format duration
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

// Helper function to create pack code from name
const getPackCode = (name: string): string => {
  return name.slice(0, 1).toUpperCase();
};

export default function QuestionPacks({ questionPacks = [] }: QuestionPackProps) {
  // UsePage hook with proper typing for flash messages
  const { props } = usePage<{ flash?: FlashMessages }>();

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [packToDelete, setPackToDelete] = useState<number | null>(null);

  // Ensure props.flash is defined with a default value
  const flash = props.flash || {};

  const handleAddPack = () => {
    // Navigate directly to the Add Package page
    router.visit('/dashboard/questionpacks/create');
  };

  const handleView = (id: number) => {
    router.visit(`/dashboard/questionpacks/${id}`);
  };

  const handleEdit = (id: number) => {
    router.visit(`/dashboard/questionpacks/${id}/edit`);
  };

  const handleDelete = (id: number) => {
    setPackToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (packToDelete !== null) {
      router.delete(`/dashboard/questionpacks/${packToDelete}`, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setPackToDelete(null);
        }
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Question Packs" />
      
      {/* Show flash message if present */}
      {flash.info && <div className="rounded-md bg-blue-50 p-4 text-blue-700 mb-4 mx-6 mt-6">{flash.info}</div>}
      {flash.success && <div className="rounded-md bg-green-50 p-4 text-green-700 mb-4 mx-6 mt-6">{flash.success}</div>}
      
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Question Packs</h2>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600 text-sm px-4 py-2"
            onClick={handleAddPack}
          >
            + Add Package
          </Button>
        </div>

        {questionPacks.length === 0 ? (
          <div className="rounded-lg bg-gray-50 py-12 text-center">
            <p className="text-gray-500">No question packs available</p>
            <Button className="mt-4 bg-blue-500 hover:bg-blue-600" onClick={handleAddPack}>
              Create Your First Package
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {questionPacks.map((pack, index) => (
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
                      Package {getPackCode(pack.pack_name)}
                    </span>
                    <h3 className="text-sm font-bold">{pack.pack_name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{pack.description || 'No description available.'}</p>
                  <div className="text-sm text-gray-700 flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{formatDuration(pack.duration)}</span>
                    <span className="text-gray-400">|</span>
                    <span>{pack.questions_count || 0} Questions</span>
                  </div>
                  <p className="text-sm text-gray-700">Type: {formatTestType(pack.test_type)}</p>
                  <div className="flex justify-end gap-4 pt-2 text-sm">
                    <Button
                      variant="link" 
                      className="text-blue-500 p-0 h-auto"
                      onClick={() => handleView(pack.id)}
                    >
                      View
                    </Button>
                    <Button
                      variant="link"
                      className="text-blue-500 p-0 h-auto"
                      onClick={() => handleEdit(pack.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      className="text-red-500 p-0 h-auto"
                      onClick={() => handleDelete(pack.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Question Pack"
        description="Are you sure you want to delete this question pack? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        confirmVariant="destructive"
      />
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
    case 'psychological':
      return 'bg-green-500';
    case 'technical':
      return 'bg-purple-500';
    case 'leadership':
      return 'bg-indigo-500';
    case 'general':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
}
