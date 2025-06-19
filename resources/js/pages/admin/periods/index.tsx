import { PeriodsTable } from '@/components/periods-table-index';
import { SearchBar } from '@/components/searchbar';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/use-local-storage';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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
  company?: {
    id: number;
    name: string;
  };
};

// Type for company data in period
type CompanyItem = {
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
  status?: string;
  title?: string;
  department?: string;
  question_pack?: string;
  applicants_count?: number;
  vacancies_list?: VacancyItem[];
  companies?: CompanyItem[];
};

// Update the Period type to include id as number for consistency
type Period = {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    status: string;
    description: string;
    title: string;
    department: string;
    questionPack: string;
    applicantsCount: number;
    vacanciesList: VacancyItem[];
    companies: CompanyItem[];
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

// Pagination interface
interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

export default function PeriodsDashboard({ 
    periods: propPeriods = [], 
    pagination: propPagination = null,
    filtering = false, 
    company = null, 
    vacancies = [] 
}: { 
    periods: PeriodData[]; 
    pagination?: PaginationData | null;
    filtering?: boolean; 
    company?: Company | null; 
    vacancies?: VacancyData[] 
}) {
    // Debug: Log company data
    console.log('Company data received:', company);
    console.log('Periods data received:', propPeriods);

    // Dynamic breadcrumbs based on company
    const breadcrumbs: BreadcrumbItem[] = company ? [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Companies',
            href: '/dashboard/companies',
        },
        {
            title: company.name,
            href: `/dashboard/companies/${company.id}/periods`,
        },
    ] : [
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

    // Function to update URL parameters without page refresh
    const updateUrlParams = (page: number, perPage: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page.toString());
        url.searchParams.set('per_page', perPage.toString());
        window.history.pushState({}, '', url.toString());
    };

    // Fix props by adding proper types
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
            // Include companies information
            companies: p.companies || [],
        };
    }) : [];

    // Initialize pagination
    const initialPagination = propPagination || {
        total: initialPeriods.length,
        per_page: 10,
        current_page: 1,
        last_page: Math.ceil(initialPeriods.length / 10),
    };

    const [periods, setPeriods] = useState<Period[]>(initialPeriods);
    const [filteredPeriods, setFilteredPeriods] = useState(initialPeriods);
    const [pagination, setPagination] = useState(initialPagination);
    const [selectedPeriodId, setSelectedPeriodId] = useLocalStorage<string | null>('selectedPeriodId', null);
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

    // Fetch periods function
    const fetchPeriods = useCallback(
        async (page = 1, perPage = pagination.per_page) => {
            setIsLoading(true);
            try {
                updateUrlParams(page, perPage);

                const response = await axios.get('/dashboard/periods/list', {
                    params: {
                        page,
                        per_page: perPage,
                    },
                });
                
                // Convert fetched periods to internal format
                const fetchedPeriods = Array.isArray(response.data.periods) ? response.data.periods.map((p: PeriodData) => {
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
                        vacanciesList: p.vacancies_list || [],
                    };
                }) : [];

                setPeriods(fetchedPeriods);
                setFilteredPeriods(fetchedPeriods);
                setPagination(response.data.pagination);
            } catch (error) {
                console.error('Error fetching periods:', error);
            } finally {
                setIsLoading(false);
            }
        },
        [pagination.per_page],
    );

    // Initialize URL params and fetch data if needed
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') ? parseInt(urlParams.get('page')!) : 1;
        const perPage = urlParams.get('per_page') ? parseInt(urlParams.get('per_page')!) : 10;

        // Only fetch if we don't have initial data or if URL params are different
        if (propPeriods.length === 0 || page !== pagination.current_page || perPage !== pagination.per_page) {
            fetchPeriods(page, perPage);
        }
    }, [fetchPeriods, pagination.current_page, pagination.per_page, propPeriods.length]);

    // Apply search filter
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredPeriods(periods);
            return;
        }
        
        const filtered = periods.filter(period => 
            period.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            period.startTime.toLowerCase().includes(searchQuery.toLowerCase()) ||
            period.endTime.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPeriods(filtered);
    }, [searchQuery, periods]);

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

    // Pagination handlers
    const handlePageChange = (page: number) => {
        fetchPeriods(page, pagination.per_page);
    };

    const handlePerPageChange = (perPage: number) => {
        fetchPeriods(1, perPage);
    };

    // Search handler
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Period selection handler - Navigate to administration page with selected period and company
    const handleSelectPeriod = (periodId: string) => {
        // Store the selected period ID in localStorage
        setSelectedPeriodId(periodId);
        
        // Get company ID from props if available, otherwise use a default value
        const companyIdParam = company ? `&company=${company.id}` : '';
        
        // Navigate to administration page with the period ID and company ID as parameters
        router.visit(`/dashboard/company/administration?period=${periodId}${companyIdParam}`);
    };

    // View period details handler
    const handleViewPeriod = (periodId: string) => {
        const period = periods.find(p => p.id === periodId);
        if (period) {
            handleViewDescription({
                description: period.description || 'No description available',
                title: period.title,
                department: period.department,
                vacanciesList: period.vacanciesList
            });
        }
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
            
            // Refresh the current page after creating
            await fetchPeriods(pagination.current_page, pagination.per_page);
            
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
            await axios.delete(`/dashboard/periods/${deletingPeriodId}`);
            
            // Refresh the current page after deleting
            await fetchPeriods(pagination.current_page, pagination.per_page);
            
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
            await axios.put(`/dashboard/periods/${editingPeriodId}`, newPeriod);
            
            // Refresh the current page after updating
            await fetchPeriods(pagination.current_page, pagination.per_page);
            
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

    // Handler for navigating to administration based on period
    const handleNavigateToAdministration = (periodId: string) => {
        // Store the selected period ID
        setSelectedPeriodId(periodId);
        
        // Find the period to get company information
        const selectedPeriod = periods.find(p => p.id === periodId);
        let companyIdParam = '';
        
        if (company) {
            // If we're on a company-specific page, use that company
            companyIdParam = `&company=${company.id}`;
        } else if (selectedPeriod && selectedPeriod.companies && selectedPeriod.companies.length > 0) {
            // If we're on global periods page, use the first company from the period
            const firstCompany = selectedPeriod.companies[0];
            companyIdParam = `&company=${firstCompany.id}`;
            
            // Log a warning if there are multiple companies
            if (selectedPeriod.companies.length > 1) {
                console.warn(`Period "${selectedPeriod.name}" has ${selectedPeriod.companies.length} companies. Using "${firstCompany.name}" as default.`);
            }
        } else {
            console.warn('No company information found for the selected period');
        }
        
        // Navigate to administration page with period parameter and company ID
        router.visit(`/dashboard/company/administration?period=${periodId}${companyIdParam}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={company ? `${company.name} - Periods` : "Periods Management"} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <h2 className="text-2xl font-semibold">
                                {company ? `${company.name} - Periods` : 'Periods Management'}
                            </h2>
                        </div>
                        <Button
                            className="flex items-center gap-2 rounded-md bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
                            onClick={handleAddPeriod}
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Period</span>
                        </Button>
                    </div>
                    
                    <Card>
                        <CardHeader className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <CardTitle>
                                    {company ? `${company.name} Periods` : 'Periods List'}
                                </CardTitle>
                                <CardDescription>
                                    {company 
                                        ? `Manage recruitment periods for ${company.name}. Click on any period to access its administration page.`
                                        : 'Manage all recruitment periods in the system. Click on any period to access its administration page.'
                                    }
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-4">
                                <SearchBar
                                    icon={<Search className="h-4 w-4" />}
                                    placeholder="Search periods..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <PeriodsTable
                                periods={filteredPeriods}
                                pagination={pagination}
                                onView={handleViewPeriod}
                                onEdit={handleEditPeriod}
                                onDelete={handleDeletePeriod}
                                onSelect={handleNavigateToAdministration}
                                selectedPeriodId={selectedPeriodId}
                                onPageChange={handlePageChange}
                                onPerPageChange={handlePerPageChange}
                                isLoading={isLoading}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create Period Dialog */}
            <Dialog open={isAddPeriodDialogOpen} onOpenChange={setIsAddPeriodDialogOpen}>
                <DialogContent className="max-w-sm overflow-hidden rounded-lg border-2 bg-white p-0 shadow-lg">
                    {/* Header with Close Button */}
                    <div className="flex items-center justify-between border-b p-4">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">Create Period</h2>
                            <p className="text-sm text-gray-500">Fill in the details to create a new period</p>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="px-4 pt-3 pb-5">
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div className="relative">
                                <label htmlFor="name" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={newPeriod.name}
                                    onChange={(e) => setNewPeriod({...newPeriod, name: e.target.value})}
                                    placeholder="Enter period name"
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Vacancies Field */}
                            <div className="relative">
                                <label className="text-sm text-blue-500 mb-2 block">Vacancies</label>
                                <div className="space-y-2 max-h-32 overflow-y-auto border border-blue-500 rounded-md p-3">
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
                                            <Label htmlFor={`vacancy-${vacancy.id}`} className="cursor-pointer text-xs text-gray-600">
                                                {vacancy.title} - {vacancy.department} {vacancy.company ? `(${vacancy.company})` : ''}
                                            </Label>
                                        </div>
                                    ))}
                                    {availableVacancies.length === 0 && (
                                        <p className="text-xs text-gray-500">No vacancies available</p>
                                    )}
                                </div>
                            </div>

                            {/* Description Field */}
                            <div className="relative">
                                <label htmlFor="description" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newPeriod.description}
                                    onChange={(e) => setNewPeriod({...newPeriod, description: e.target.value})}
                                    placeholder="Enter period description"
                                    rows={3}
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
                                />
                            </div>

                            {/* Start Date Field */}
                            <div className="relative">
                                <label htmlFor="start_time" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Start Date
                                </label>
                                <input
                                    id="start_time"
                                    name="start_time"
                                    type="date"
                                    value={newPeriod.start_time}
                                    onChange={(e) => setNewPeriod({...newPeriod, start_time: e.target.value})}
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* End Date Field */}
                            <div className="relative">
                                <label htmlFor="end_time" className="absolute top-2 left-3 text-sm text-blue-500">
                                    End Date
                                </label>
                                <input
                                    id="end_time"
                                    name="end_time"
                                    type="date"
                                    value={newPeriod.end_time}
                                    onChange={(e) => setNewPeriod({...newPeriod, end_time: e.target.value})}
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Footer/Buttons */}
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={() => setIsAddPeriodDialogOpen(false)}
                                className="rounded-md border border-blue-500 bg-white px-4 py-1.5 text-sm font-medium text-blue-500 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreatePeriod}
                                disabled={isLoading}
                                className="rounded-md bg-blue-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
                            >
                                {isLoading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Period Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-sm overflow-hidden rounded-lg border-2 bg-white p-0 shadow-lg">
                    {/* Header with Close Button */}
                    <div className="flex items-center justify-between border-b p-4">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900">Edit Period</h2>
                            <p className="text-sm text-gray-500">Update the details of the period</p>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="px-4 pt-3 pb-5">
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div className="relative">
                                <label htmlFor="edit-name" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Name
                                </label>
                                <input
                                    id="edit-name"
                                    name="name"
                                    type="text"
                                    value={newPeriod.name}
                                    onChange={(e) => setNewPeriod({...newPeriod, name: e.target.value})}
                                    placeholder="Enter period name"
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Vacancies Field */}
                            <div className="relative">
                                <label className="text-sm text-blue-500 mb-2 block">Vacancies</label>
                                <div className="space-y-2 max-h-32 overflow-y-auto border border-blue-500 rounded-md p-3">
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
                                            <Label htmlFor={`edit-vacancy-${vacancy.id}`} className="cursor-pointer text-xs text-gray-600">
                                                {vacancy.title} - {vacancy.department} {vacancy.company ? `(${vacancy.company})` : ''}
                                            </Label>
                                        </div>
                                    ))}
                                    {availableVacancies.length === 0 && (
                                        <p className="text-xs text-gray-500">No vacancies available</p>
                                    )}
                                </div>
                            </div>

                            {/* Description Field */}
                            <div className="relative">
                                <label htmlFor="edit-description" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Description
                                </label>
                                <textarea
                                    id="edit-description"
                                    name="description"
                                    value={newPeriod.description}
                                    onChange={(e) => setNewPeriod({...newPeriod, description: e.target.value})}
                                    placeholder="Enter period description"
                                    rows={3}
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
                                />
                            </div>

                            {/* Start Date Field */}
                            <div className="relative">
                                <label htmlFor="edit-start_time" className="absolute top-2 left-3 text-sm text-blue-500">
                                    Start Date
                                </label>
                                <input
                                    id="edit-start_time"
                                    name="start_time"
                                    type="date"
                                    value={newPeriod.start_time}
                                    onChange={(e) => setNewPeriod({...newPeriod, start_time: e.target.value})}
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* End Date Field */}
                            <div className="relative">
                                <label htmlFor="edit-end_time" className="absolute top-2 left-3 text-sm text-blue-500">
                                    End Date
                                </label>
                                <input
                                    id="edit-end_time"
                                    name="end_time"
                                    type="date"
                                    value={newPeriod.end_time}
                                    onChange={(e) => setNewPeriod({...newPeriod, end_time: e.target.value})}
                                    className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Footer/Buttons */}
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                onClick={() => setIsEditDialogOpen(false)}
                                className="rounded-md border border-blue-500 bg-white px-4 py-1.5 text-sm font-medium text-blue-500 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdatePeriod}
                                disabled={isLoading}
                                className="rounded-md bg-blue-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
                            >
                                {isLoading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Period Details Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Period Details</DialogTitle>
                        <DialogDescription>Detailed information about the selected period.</DialogDescription>
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
                            <p className="text-gray-700">{currentDescription}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsViewDialogOpen(false)} className="bg-blue-500 text-white hover:bg-blue-600">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Period Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this period? This action cannot be undone.
                            All applicants associated with this period will also be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeletePeriod} className="bg-blue-500 text-white hover:bg-blue-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
