import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Test & Assessment', href: '#' },
  { title: 'Add Test', href: '/dashboard/questions/question-packs/add' },
];

export default function AddQuestionPacks() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [duration, setDuration] = useState({ hours: '', minutes: '', seconds: '' });

  const handleNext = () => {
    console.log({ title, description, type, duration });
    // TODO: Navigate to next step or send to backend
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Test" />
      <div className="flex flex-col p-6">
        <Card className="w-full p-6">
          <CardContent className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Add Package</h2>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-blue-500">
                Test Title
              </Label>
              <Input
                id="title"
                placeholder="Enter test title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-blue-500">
                Test Description
              </Label>
              <Input
                id="description"
                placeholder="Enter test description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-blue-500">
                  Test Type
                </Label>
                <Select value={type} onValueChange={(value) => setType(value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Logic">Logic</SelectItem>
                    <SelectItem value="Emotional">Emotional</SelectItem>
                    <SelectItem value="Personality">Personality</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-blue-500">
                    Test Duration
                </Label>
                <div className="flex items-center gap-2 border rounded-lg px-4 py-2 w-full max-w-xs">
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

            <div className="flex justify-end mt-4">
            <Button
            onClick={() => {
                router.post('/dashboard/questions/question-packs/temp-store', {
                title,
                description,
                test_type: type,
                duration: `${duration.hours.padStart(2, '0')}:${duration.minutes.padStart(2, '0')}:${duration.seconds.padStart(2, '0')}`,
                });
            }}
            className="bg-blue-500 text-white hover:bg-blue-600"
            disabled={!title || !description || !type}
            >
            Next
            </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
