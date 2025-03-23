import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormLabel } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react'; // Add Head component
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
interface Candidate {
    id: number;
    name: string;
    email: string;
    position: string;
}

interface AssignTestProps {
    candidates: Candidate[];
    testTypes: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        title: 'Candidate Tests',
        href: route('admin.candidate-tests'),
    },
    {
        title: 'Assign Test',
        href: route('admin.candidate-tests.create'),
    },
];

const durations = ['10 menit', '20 menit', '30 menit', '45 menit', '60 menit'];

export default function AssignTest({ candidates, testTypes }: AssignTestProps) {
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [selectedTestType, setSelectedTestType] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');
    const [instructions, setInstructions] = useState('');
    const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);

    const handleSubmit = () => {
        if (!selectedCandidate || !selectedTestType || !selectedDuration || !scheduledDate) {
            alert('Please fill all required fields');
            return;
        }

        // Use route helper instead of hardcoded path
        router.post(route('admin.candidate-tests.store'), {
            candidate_id: selectedCandidate,
            test_type: selectedTestType,
            duration: selectedDuration,
            scheduled_date: scheduledDate.toISOString(),
            instructions: instructions,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assign Test" /> {/* Add page title */}
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {' '}
                {/* Add consistent container styling */}
                <div className="mx-auto py-6" style={{ width: '80%' }}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Assign Psychometric Test to Candidate</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <FormLabel>Select Candidate</FormLabel>
                                <Select onValueChange={setSelectedCandidate}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a candidate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {candidates.map((candidate) => (
                                            <SelectItem key={candidate.id} value={candidate.id.toString()}>
                                                {candidate.name} - {candidate.position}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <FormLabel>Test Type</FormLabel>
                                <Select onValueChange={setSelectedTestType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select test type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {testTypes.map((type, index) => (
                                            <SelectItem key={index} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <FormLabel>Test Duration</FormLabel>
                                    <Select onValueChange={setSelectedDuration}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {durations.map((duration, index) => (
                                                <SelectItem key={index} value={duration}>
                                                    {duration}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <FormLabel>Scheduled Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {scheduledDate ? format(scheduledDate, 'PPP') : 'Select a date'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <FormLabel>Instructions for Candidate</FormLabel>
                                <Textarea
                                    placeholder="Provide specific instructions for the candidate"
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    rows={5}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={handleSubmit}>Assign Test</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
