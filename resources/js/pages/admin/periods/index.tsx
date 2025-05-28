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
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';

// Add a type for the company prop
type Company = {
  id: number;
  name: string;
};

// Type for vacancy data in period
type VacancyItem = {
  id: number;
  title: string;
  department: string;
};

// Add proper types for the period prop
type PeriodData = {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  title?: string;
  department?: string;
  question_pack?: string;
  applicants_count?: number;
  vacancies_list?: VacancyItem[];
};

// Update the Period type to include id as number for consistency
type Period = {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    status: string;
    description?: string;
    title?: string;
    department?: string;
    questionPack?: string;
    applicantsCount?: number;
    vacanciesList?: VacancyItem[];
};

// Add a type for vacancy data
type VacancyData = {
    id: number;
    title: string;
    department: string;
    company?: string;
    start_date?: string;
    end_date?: string;
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

// Format dates for HTML date input (YYYY-MM-DD format)
const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch (e) {
        return dateString || '';
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
    vacancies?: VacancyData[] 
}) {
    // Convert prop periods to internal format if provided with proper type check
    const initialPeriods = Array.isArray(propPeriods) ? propPeriods.map(p => {
        // Calculate status if not provided from backend
        let status = p.status || 'Not Set';
        
        if (!status && p.start_date && p.end_date) {
            const now = new Date();
            const startDate = new Date(p.start_date);
            const endDate = new Date(p.end_date);
            
            if (now < startDate) {
                status = 'Upcoming';
            } else if (now > endDate) {
                status = 'Closed';
            } else {
                status = 'Open';
            }
        }
        
        return {
            id: String(p.id || ''),
            name: p.name || '',
            startTime: p.start_date ? formatSimpleDate(p.start_date) : '',
            endTime: p.end_date ? formatSimpleDate(p.end_date) : '',
            description: p.description || '',
            status: status,
            title: p.title || '',
            department: p.department || '',
            questionPack: p.question_pack || '',
            applicantsCount: p.applicants_count || 0,
            // Include the full list of vacancies
            vacanciesList: p.vacancies_list || [],
        };
    }) : [];

    const [periods, setPeriods] = useState<Period[]>(initialPeriods);
    const [selectedPeriodId, setSelectedPeriodId] = useLocalStorage<string | null>('selectedPeriodId', null);
    const [filteredPeriods, setFilteredPeriods] = useState(periods);
    const [searchQuery, setSearchQuery] = useState('');
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [currentDescription, setCurrentDescription] = useState('');
    const [currentPeriodDetails, setCurrentPeriodDetails] = useState<{
        title?: string; 
        department?: string;
        vacancies?: VacancyItem[];
    }>({});
    
    // New state for Add Period dialog
    const [isAddPeriodDialogOpen, setIsAddPeriodDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [availableVacancies, setAvailableVacancies] = useState<VacancyData[]>(vacancies);
    const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
    const [deletingPeriodId, setDeletingPeriodId] = useState<string | null>(null);

    // New period form state
    const [newPeriod, setNewPeriod] = useState({
        name: '',
        description: '',
        start_time: '',
        end_time: '',
        vacancies_ids: [] as string[],
    });

    // When periods change, update filtered periods
    useEffect(() => {
        setFilteredPeriods(periods);
    }, [periods]);

    // Fetch vacancies with details when component mounts if none provided
    useEffect(() => {
        if (vacancies.length === 0) {
            const fetchVacancies = async () => {
                try {
                    const response = await axios.get('/api/vacancies');
                    setAvailableVacancies(response.data);
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

    // Updated to include multiple positions and departments from vacancies
    const handleViewDescription = (period: { 
        description: string; 
        title?: string; 
        department?: string;
        vacanciesList?: VacancyItem[];
    }) => {
        setCurrentDescription(period.description);
        setCurrentPeriodDetails({
            title: period.title || '-',
            department: period.department || '-',
            vacancies: period.vacanciesList || [],
        });
        setIsViewDialogOpen(true);
    };

    const handleAddPeriod = () => {
        setNewPeriod({
            name: '',
            description: '',
            start_time: '',
            end_time: '',
            vacancies_ids: [],
        });
        setIsAddPeriodDialogOpen(true);
    };

    const handleEditPeriod = async (periodId: string) => {
        const period = periods.find(p => p.id === periodId);
        if (period) {
            // Fetch the period details including vacancies
            try {
                const response = await axios.get(`/dashboard/periods/${periodId}/edit`);
                const periodData = response.data.period;
                
                // Use our shared formatDateForInput function
                
                setNewPeriod({
                    name: periodData.name,
                    description: periodData.description || '',
                    start_time: formatDateForInput(periodData.start_time) || '',
                    end_time: formatDateForInput(periodData.end_time) || '',
                    vacancies_ids: periodData.vacancies_ids || [],
                });
                setEditingPeriodId(periodId);
                setIsEditDialogOpen(true);
            } catch (error) {
                console.error('Error fetching period details:', error);
                // Fallback to using just the data we have
                setNewPeriod({
                    name: period.name,
                    description: period.description || '',
                    start_time: '',
                    end_time: '',
                    vacancies_ids: [],
                });
                setEditingPeriodId(periodId);
                setIsEditDialogOpen(true);
            }
        }
    };

    const handleCreatePeriod = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/dashboard/periods', newPeriod);
            
            // Properly format the data that comes back from the API
            // Handle both response formats: {period: {...}} or direct {...}
            const periodData = response.data.period || response.data;
            
            // Log the response to debug
            console.log('Period creation response:', response.data);
            
            // Create a new period object in the format our UI expects
            const newPeriodFormatted: Period = {
                id: String(periodData.id || ''),
                name: periodData.name || '',
                startTime: periodData.start_date || '',
                endTime: periodData.end_date || '', 
                description: periodData.description || '',
                title: periodData.title || '',
                department: periodData.department || '',
                status: periodData.status || 'Not Set',
                questionPack: periodData.question_pack || '',
                applicantsCount: periodData.applicants_count || 0,
            };
            
            // Update both state arrays with the new period
            setPeriods(prevPeriods => [...prevPeriods, newPeriodFormatted]);
            setFilteredPeriods(prevFiltered => [...prevFiltered, newPeriodFormatted]);
            
            // Reset form and close dialog
            setNewPeriod({
                name: '',
                description: '',
                start_time: '',
                end_time: '',
                vacancies_ids: [],
            });
            setIsAddPeriodDialogOpen(false);
            
            // Show success message
            alert('Period created successfully');
            
        } catch (error) {
            console.error('Error creating period:', error);
            alert('Failed to create period. Please check all fields and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePeriod = (periodId: string) => {
        setDeletingPeriodId(periodId);
        setIsDeleteDialogOpen(true);
    };
    
    const confirmDeletePeriod = async () => {
        if (!deletingPeriodId) return;
        
        try {
            setIsLoading(true);
            const response = await axios.delete(`/dashboard/periods/${deletingPeriodId}`);
            
            // Log the response for debugging
            console.log('Period deletion response:', response.data);
            
            // Remove the deleted period from both arrays
            setPeriods(prevPeriods => prevPeriods.filter(p => p.id !== deletingPeriodId));
            setFilteredPeriods(prevFiltered => prevFiltered.filter(p => p.id !== deletingPeriodId));
            
            setIsDeleteDialogOpen(false);
            
            // Show success message
            alert('Period deleted successfully');
        } catch (error) {
            console.error('Error deleting period:', error);
            alert('Failed to delete period');
        } finally {
            setIsLoading(false);
            setDeletingPeriodId(null);
        }
    };

    const handleUpdatePeriod = async () => {
        if (!editingPeriodId) return;
        
        setIsLoading(true);
        try {
            const response = await axios.put(`/dashboard/periods/${editingPeriodId}`, newPeriod);
            
            // Get the updated period data and handle both response formats
            const periodData = response.data.period || response.data;
            
            // Log the response to debug
            console.log('Period update response:', response.data);
            
            // Update the periods array with the edited period, with safeguards
            const updatedPeriods = periods.map(period => 
                period.id === editingPeriodId 
                    ? { 
                        ...period, 
                        name: periodData?.name || period.name,
                        description: periodData?.description || period.description || '',
                        startTime: periodData?.start_date || period.startTime,
                        endTime: periodData?.end_date || period.endTime,
                        title: periodData?.title || period.title,
                        department: periodData?.department || period.department,
                        status: periodData?.status || period.status,
                        questionPack: periodData?.question_pack || period.questionPack,
                      }
                    : period
            );
            
            // Update state
            setPeriods(updatedPeriods);
            setFilteredPeriods(updatedPeriods);
            setIsEditDialogOpen(false);
            
            // Reset form
            setNewPeriod({
                name: '',
                description: '',
                start_time: '',
                end_time: '',
                vacancies_ids: [],
            });
            
            // Show success message
            alert('Period updated successfully');
        } catch (error) {
            console.error('Error updating period:', error);
            alert('Failed to update period. Please check all fields and try again.');
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
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">Start Date</th>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">End Date</th>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">Status</th>
                                        <th className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-gray-900">Applicants</th>
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
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{period.startTime || '-'}</td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{period.endTime || '-'}</td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    period.status === 'Open' ? 'bg-green-100 text-green-800' : 
                                                    period.status === 'Closed' ? 'bg-red-100 text-red-800' : 
                                                    period.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {period.status || 'Not Set'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{period.applicantsCount || 0}</td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        onClick={() => handleViewDescription({
                                                            description: period.description || 'No description available',
                                                            title: period.title,
                                                            department: period.department,
                                                            vacanciesList: period.vacanciesList
                                                        })}
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
                                                        onClick={() => handleDeletePeriod(period.id)}
                                                        size="sm"
                                                        variant="ghost" 
                                                        className="h-8 w-8 p-0 text-red-500"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M3 6h18"></path>
                                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                        </svg>
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

            {/* Period Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-md" aria-describedby="period-details-text">
                    <DialogHeader>
                        <DialogTitle>Period Details</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {/* Display positions and departments */}
                        <div className="space-y-4">
                            <div className="font-medium text-lg">Positions:</div>
                            {currentPeriodDetails.vacancies && currentPeriodDetails.vacancies.length > 0 ? (
                                <div className="rounded-md border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-medium text-gray-900">Title</th>
                                                <th className="px-4 py-2 text-left font-medium text-gray-900">Department</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {currentPeriodDetails.vacancies.map((vacancy, index) => (
                                                <tr key={vacancy.id || index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2">{vacancy.title || '-'}</td>
                                                    <td className="px-4 py-2">{vacancy.department || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-gray-500 italic">No positions available.</div>
                            )}
                        </div>
                        
                        <div className="mt-4">
                            <div className="font-medium mb-2">Description:</div>
                            <p id="period-details-text" className="text-gray-700">{currentDescription}</p>
                        </div>
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
                <DialogContent className="sm:max-w-md" aria-describedby="add-period-form">
                    <DialogHeader>
                        <DialogTitle>Add Period</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4" id="add-period-form">
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
                            <Label htmlFor="vacancies">Vacancies</Label>
                            <div className="space-y-2">
                                {availableVacancies.map((vacancy) => (
                                    <div key={vacancy.id} className="flex items-center gap-2">
                                        <Checkbox 
                                            id={`vacancy-${vacancy.id}`}
                                            checked={newPeriod.vacancies_ids.includes(String(vacancy.id))}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setNewPeriod({
                                                        ...newPeriod, 
                                                        vacancies_ids: [...newPeriod.vacancies_ids, String(vacancy.id)]
                                                    });
                                                } else {
                                                    setNewPeriod({
                                                        ...newPeriod, 
                                                        vacancies_ids: newPeriod.vacancies_ids.filter(id => id !== String(vacancy.id))
                                                    });
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`vacancy-${vacancy.id}`} className="cursor-pointer text-sm">
                                            {vacancy.title} - {vacancy.department} {vacancy.company ? `(${vacancy.company})` : ''}
                                        </Label>
                                    </div>
                                ))}
                                {availableVacancies.length === 0 && (
                                    <p className="text-sm text-gray-500">No vacancies available</p>
                                )}
                            </div>
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
                        <div>
                            <Label htmlFor="start_time">Start Date</Label>
                            <Input
                                id="start_time"
                                name="start_time"
                                type="date"
                                value={newPeriod.start_time}
                                onChange={(e) => setNewPeriod({...newPeriod, start_time: e.target.value})}
                            />
                        </div>
                        <div>
                            <Label htmlFor="end_time">End Date</Label>
                            <Input
                                id="end_time"
                                name="end_time"
                                type="date"
                                value={newPeriod.end_time}
                                onChange={(e) => setNewPeriod({...newPeriod, end_time: e.target.value})}
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
                <DialogContent className="sm:max-w-md" aria-describedby="edit-period-form">
                    <DialogHeader>
                        <DialogTitle>Edit Period</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4" id="edit-period-form">
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
                            <Label htmlFor="edit-vacancies">Vacancies</Label>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {availableVacancies.map((vacancy) => (
                                    <div key={vacancy.id} className="flex items-center gap-2">
                                        <Checkbox 
                                            id={`edit-vacancy-${vacancy.id}`}
                                            checked={newPeriod.vacancies_ids.includes(String(vacancy.id))}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setNewPeriod({
                                                        ...newPeriod, 
                                                        vacancies_ids: [...newPeriod.vacancies_ids, String(vacancy.id)]
                                                    });
                                                } else {
                                                    setNewPeriod({
                                                        ...newPeriod, 
                                                        vacancies_ids: newPeriod.vacancies_ids.filter(id => id !== String(vacancy.id))
                                                    });
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`edit-vacancy-${vacancy.id}`} className="cursor-pointer text-sm">
                                            {vacancy.title} - {vacancy.department} {vacancy.company ? `(${vacancy.company})` : ''}
                                        </Label>
                                    </div>
                                ))}
                                {availableVacancies.length === 0 && (
                                    <p className="text-sm text-gray-500">No vacancies available</p>
                                )}
                            </div>
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
                        <div>
                            <Label htmlFor="edit-start_time">Start Date</Label>
                            <Input
                                id="edit-start_time"
                                name="start_time"
                                type="date"
                                value={newPeriod.start_time}
                                onChange={(e) => setNewPeriod({...newPeriod, start_time: e.target.value})}
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-end_time">End Date</Label>
                            <Input
                                id="edit-end_time"
                                name="end_time"
                                type="date"
                                value={newPeriod.end_time}
                                onChange={(e) => setNewPeriod({...newPeriod, end_time: e.target.value})}
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

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md" aria-describedby="delete-confirmation-text">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p id="delete-confirmation-text" className="text-center text-gray-600">
                            Are you sure you want to delete this period? This action cannot be undone.
                            All applicants associated with this period will also be deleted.
                        </p>
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive"
                            onClick={confirmDeletePeriod} 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
