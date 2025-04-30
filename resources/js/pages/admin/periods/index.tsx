import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { SearchBar } from '@/components/searchbar';
import { Search, Plus, Check, Eye } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// Updated type to include name and remove job
type Period = {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    description?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Periods List',
        href: '/dashboard/periods',
    },
];

export default function PeriodsDashboard() {
    // Sample data for the periods
    const [periods] = useState<Period[]>([
        {
            id: '01',
            name: 'Q1 2025 Recruitment',
            startTime: '01/01/2025',
            endTime: '02/04/2025',
            description: 'First quarter recruitment period for 2025',
        },
        {
            id: '02',
            name: 'Q2 2025 Recruitment',
            startTime: '01/02/2025',
            endTime: '05/05/2025',
            description: 'Second quarter recruitment period for 2025',
        },
        {
            id: '03',
            name: 'Q3 2025 Recruitment',
            startTime: '01/01/2025',
            endTime: '02/04/2025',
            description: 'Third quarter recruitment period for 2025',
        },
        {
            id: '04',
            name: 'Q4 2025 Recruitment',
            startTime: '01/02/2025',
            endTime: '05/05/2025',
            description: 'Fourth quarter recruitment period for 2025',
        },
        {
            id: '05',
            name: 'Special Recruitment',
            startTime: '01/02/2025',
            endTime: '05/05/2025',
            description: 'Special recruitment campaign for technical positions',
        },
    ]);

    const [selectedPeriodId, setSelectedPeriodId] = useLocalStorage<string | null>('selectedPeriodId', null);
    const [filteredPeriods, setFilteredPeriods] = useState(periods);
    const [searchQuery, setSearchQuery] = useState('');
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [currentDescription, setCurrentDescription] = useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredPeriods(periods);
            return;
        }
        
        const filtered = periods.filter(period => 
            period.name.toLowerCase().includes(query.toLowerCase()) ||
            period.startTime.toLowerCase().includes(query.toLowerCase()) ||
            period.endTime.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredPeriods(filtered);
    };

    const handleSelectPeriod = (periodId: string) => {
        setSelectedPeriodId(periodId === selectedPeriodId ? null : periodId);
    };

    const handleViewDescription = (description: string) => {
        setCurrentDescription(description);
        setIsViewDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Periods Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Periods List</h2>
                        <div className="flex space-x-2">
                            <SearchBar
                                icon={<Search className="h-4 w-4" />}
                                placeholder="Search periods..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Period
                            </Button>
                        </div>
                    </div>
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-left">
                                    <tr>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">ID</th>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">Name</th>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">Start Time</th>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">End Time</th>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredPeriods.map((period) => (
                                        <tr 
                                            key={period.id} 
                                            className={`
                                                ${selectedPeriodId === period.id 
                                                    ? 'bg-green-100 hover:bg-green-200' 
                                                    : 'hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <td className="px-4 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{period.id}</td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{period.name}</td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{period.startTime}</td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{period.endTime}</td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        onClick={() => handleViewDescription(period.description || 'No description available')}
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-blue-500"
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleSelectPeriod(period.id)}
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-blue-500"
                                                    >
                                                        {selectedPeriodId === period.id ? <Check size={16} /> : "-"}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPeriods.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                                                No periods found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Description Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Period Description</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>{currentDescription}</p>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
