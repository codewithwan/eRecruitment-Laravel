import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/searchbar';
import { Search, Plus, Check, Eye, Edit } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { format } from 'date-fns';

// Add a type for the company prop
type Company = {
  id: number;
  name: string;
};

// Add proper types for the period prop
type PeriodData = {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
};

// Update the Period type to include id as number for consistency
type Period = {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    description?: string;
};

// Add a type for vacancy date ranges
type VacancyPeriod = {
    id: number;
    start_date: string;
    end_date: string;
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

// Improved helper function to format dates to simple DD/MM/YYYY format
const formatSimpleDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
        // If already in DD/MM/YYYY format, return as is
        if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
            return dateString;
        }
        
        // Handle ISO date strings
        if (dateString.includes('T') || dateString.includes('-')) {
            const parts = dateString.split(/[-T]/);
            if (parts.length >= 3) {
                // Extract year, month, day
                const year = parts[0];
                const month = parts[1];
                const day = parts[2].split(':')[0].split(' ')[0];
                
                return `${day}/${month}/${year}`;
            }
        }
        
        return dateString;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

// Fix props by adding proper types
export default function PeriodsDashboard({ 
    periods: propPeriods = [], 
    filtering = false, 
    company = null, 
    vacancies = [] 
}: { 
    periods: PeriodData[]; 
    filtering?: boolean; 
    company?: Company | null; 
    vacancies?: VacancyPeriod[] 
}) {
    // Convert prop periods to internal format if provided with proper type check
    const initialPeriods = Array.isArray(propPeriods) ? propPeriods.map(p => ({
        id: String(p.id || ''),
        name: p.name || '',
        startTime: p.start_date ? formatSimpleDate(p.start_date) : '',
        endTime: p.end_date ? formatSimpleDate(p.end_date) : '',
        description: p.description || '',
    })) : [];

    const [periods, setPeriods] = useState<Period[]>(initialPeriods);
    const [selectedPeriodId, setSelectedPeriodId] = useLocalStorage<string | null>('selectedPeriodId', null);
    const [filteredPeriods, setFilteredPeriods] = useState(periods);
    const [searchQuery, setSearchQuery] = useState('');
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [currentDescription, setCurrentDescription] = useState('');
    
    // New state for Add Period dialog
    const [isAddPeriodDialogOpen, setIsAddPeriodDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [availableVacancyPeriods, setAvailableVacancyPeriods] = useState<VacancyPeriod[]>(vacancies);
    const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);

    // New period form state
    const [newPeriod, setNewPeriod] = useState({
        name: '',
        description: '',
        vacancies_id: '',
    });

    // When periods change, update filtered periods
    useEffect(() => {
        setFilteredPeriods(periods);
    }, [periods]);

    // Fetch vacancies with date ranges when component mounts if none provided
    useEffect(() => {
        if (vacancies.length === 0) {
            const fetchVacancies = async () => {
                try {
                    const response = await axios.get('/api/vacancies/periods');
                    setAvailableVacancyPeriods(response.data);
                } catch (error) {
                    console.error('Error fetching vacancies:', error);
                }
            };
            
            fetchVacancies();
        }
    }, [vacancies]);

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

    const handleAddPeriod = () => {
        setNewPeriod({
            name: '',
            description: '',
            vacancies_id: '',
        });
        setIsAddPeriodDialogOpen(true);
    };

    const handleEditPeriod = (periodId: string) => {
        const period = periods.find(p => p.id === periodId);
        if (period) {
            setNewPeriod({
                name: period.name,
                description: period.description || '',
                vacancies_id: '', // This would need to be populated from the backend
            });
            setEditingPeriodId(periodId);
            setIsEditDialogOpen(true);
        }
    };

    const handleCreatePeriod = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/dashboard/periods', newPeriod);
            
            // Properly format the data that comes back from the API
            const periodData = response.data.period;
            
            // Create a new period object in the format our UI expects
            const newPeriodFormatted: Period = {
                id: String(periodData.id),
                name: periodData.name,
                startTime: periodData.start_date ? formatSimpleDate(periodData.start_date) : '',
                endTime: periodData.end_date ? formatSimpleDate(periodData.end_date) : '',
                description: periodData.description || '',
            };
            
            // Update both state arrays with the new period
            setPeriods(prevPeriods => [...prevPeriods, newPeriodFormatted]);
            setFilteredPeriods(prevFiltered => [...prevFiltered, newPeriodFormatted]);
            
            // Reset form and close dialog
            setNewPeriod({
                name: '',
                description: '',
                vacancies_id: '',
            });
            setIsAddPeriodDialogOpen(false);
            
        } catch (error) {
            console.error('Error creating period:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePeriod = async () => {
        if (!editingPeriodId) return;
        
        setIsLoading(true);
        try {
            const response = await axios.put(`/dashboard/periods/${editingPeriodId}`, newPeriod);
            
            // Get the updated period data
            const periodData = response.data.period;
            
            // Update the periods array with the edited period
            const updatedPeriods = periods.map(period => 
                period.id === editingPeriodId 
                    ? { 
                        ...period, 
                        name: periodData.name,
                        description: periodData.description || '',
                        startTime: formatSimpleDate(periodData.start_date || period.startTime),
                        endTime: formatSimpleDate(periodData.end_date || period.endTime),
                      }
                    : period
            );
            
            // Update state
            setPeriods(updatedPeriods);
            setFilteredPeriods(updatedPeriods);
            setIsEditDialogOpen(false);
        } catch (error) {
            console.error('Error updating period:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Periods Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">
                            {company && company.name ? `${company.name} - Periods` : 'Periods List'}
                        </h2>
                        <div className="flex space-x-2">
                            <SearchBar
                                icon={<Search className="h-4 w-4" />}
                                placeholder="Search periods..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <Button onClick={handleAddPeriod}>
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
                                                        onClick={() => handleEditPeriod(period.id)}
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-blue-500"
                                                    >
                                                        <Edit size={16} />
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

            {/* Add Period Dialog */}
            <Dialog open={isAddPeriodDialogOpen} onOpenChange={setIsAddPeriodDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Period</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input 
                                id="name" 
                                name="name" 
                                placeholder="Enter period name"
                                value={newPeriod.name} 
                                onChange={(e) => setNewPeriod({...newPeriod, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <Label htmlFor="period">Period</Label>
                            <Select 
                                value={newPeriod.vacancies_id} 
                                onValueChange={(value) => setNewPeriod({...newPeriod, vacancies_id: value})}
                            >
                                <SelectTrigger id="period">
                                    <SelectValue placeholder="Select a period" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableVacancyPeriods.map((vacancy) => (
                                        <SelectItem key={vacancy.id} value={String(vacancy.id)}>
                                            {`${vacancy.start_date || ''} - ${vacancy.end_date || ''}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Enter period description"
                                value={newPeriod.description}
                                onChange={(e) => setNewPeriod({...newPeriod, description: e.target.value})}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button variant="outline" onClick={() => setIsAddPeriodDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreatePeriod} disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Period Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Period</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="edit-name">Name</Label>
                            <Input 
                                id="edit-name" 
                                name="name" 
                                placeholder="Enter period name"
                                value={newPeriod.name} 
                                onChange={(e) => setNewPeriod({...newPeriod, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                name="description"
                                placeholder="Enter period description"
                                value={newPeriod.description}
                                onChange={(e) => setNewPeriod({...newPeriod, description: e.target.value})}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpdatePeriod} disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
