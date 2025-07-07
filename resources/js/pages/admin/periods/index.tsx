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
import { Plus, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Add type for the company prop
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

// Add type for Inertia page props
type PageProps = {
    periods: PeriodData[];
    company?: Company | null;
    filtering?: boolean;
    vacancies?: VacancyData[];
    editingPeriod?: {
        id: number;
        name: string;
        description: string;
        start_time: string;
        end_time: string;
        vacancies_ids: string[];
    } | null;
    success?: string;
    errors?: { error: string };
};


// Update type for vacancies response
type VacanciesResponse = {
    vacancies: VacancyData[];
};

export default function PeriodsDashboard({ 
    periods: propPeriods = [], 
    company = null, 
    vacancies = [],
    editingPeriod = null,
    success,
    errors
}: PageProps) {

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
            // If the date is in DD/MM/YYYY format, convert it to YYYY-MM-DD
            if (dateString.includes('/')) {
                const [day, month, year] = dateString.split('/');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
            // If it's already in YYYY-MM-DD format, return as is
            if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return dateString;
            }
            // Otherwise try to parse and format
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
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

    // Initialize pagination with default values
    const defaultPagination: PaginationData = {
        total: propPeriods.length,
        per_page: 10,
        current_page: 1,
        last_page: Math.ceil(propPeriods.length / 10),
    };

    const [currentPage, setCurrentPage] = useState(defaultPagination.current_page);
    const [perPage, setPerPage] = useState(defaultPagination.per_page);

    const [periods, setPeriods] = useState<Period[]>(initialPeriods);
    const [filteredPeriods, setFilteredPeriods] = useState(initialPeriods);
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
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        start_time: '',
        end_time: '',
        vacancies_ids: [] as string[]
    });

    // New period form state
    const [newPeriod, setNewPeriod] = useState({
        name: '',
        description: '',
        start_time: '',
        end_time: '',
        vacancies_ids: [] as string[],
    });

    // Update the fetchPeriods function to handle data transformation
    const fetchPeriods = useCallback(
        (page = 1, itemsPerPage = perPage) => {
            setIsLoading(true);
            const url = company?.id 
                ? `/dashboard/companies/${company.id}/periods`
                : '/dashboard/periods';
                
            router.get(url, {
                page: page.toString(),
                per_page: itemsPerPage.toString(),
            }, {
                onSuccess: (response) => {
                    const pageData = response.props as unknown as { periods: PeriodData[]; pagination: PaginationData };
                    const transformedPeriods = pageData.periods.map(p => ({
                        id: String(p.id || ''),
                        name: p.name || '',
                        startTime: p.start_date ? formatSimpleDate(p.start_date) : '',
                        endTime: p.end_date ? formatSimpleDate(p.end_date) : '',
                        description: p.description || '',
                        status: p.status || 'Not Set',
                        title: p.title || '',
                        department: p.department || '',
                        questionPack: p.question_pack || '',
                        applicantsCount: p.applicants_count || 0,
                        vacanciesList: p.vacancies_list || [],
                        companies: p.companies || [],
                    }));
                    setPeriods(transformedPeriods);
                    setFilteredPeriods(transformedPeriods);
                    if (pageData.pagination) {
                        setCurrentPage(pageData.pagination.current_page);
                        setPerPage(pageData.pagination.per_page);
                    }
                    setIsLoading(false);
                },
                onError: () => setIsLoading(false)
            });
        },
        [perPage, company?.id],
    );

    // Initialize URL params and fetch data if needed
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') ? parseInt(urlParams.get('page')!) : 1;
        const perPage = urlParams.get('per_page') ? parseInt(urlParams.get('per_page')!) : 10;

        // Only fetch if we don't have initial data or if URL params are different
        if (propPeriods.length === 0 || page !== currentPage || perPage !== perPage) {
            fetchPeriods(page, perPage);
        }
    }, [fetchPeriods, currentPage, perPage, propPeriods.length]);

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
            router.get('/dashboard/vacancies/list', {}, {
                preserveState: true,
                onSuccess: (page) => {
                    const response = page.props as unknown as VacanciesResponse;
                    setAvailableVacancies(response.vacancies);
                },
                onError: (error) => {
                    console.error('Error fetching vacancies:', error);
                }
            });
        }
    }, [vacancies]);

    // Effect to handle editing period data
    useEffect(() => {
        if (editingPeriod) {
            setNewPeriod({
                name: editingPeriod.name,
                description: editingPeriod.description || '',
                start_time: formatDateForInput(editingPeriod.start_time) || '',
                end_time: formatDateForInput(editingPeriod.end_time) || '',
                vacancies_ids: editingPeriod.vacancies_ids || [],
            });
            setEditingPeriodId(String(editingPeriod.id));
            setIsEditDialogOpen(true);
        }
    }, [editingPeriod]);

    // Effect to handle success/error messages
    useEffect(() => {
        if (success) {
            toast.success(success);
            setIsEditDialogOpen(false);
            setNewPeriod({
                name: '',
                description: '',
                start_time: '',
                end_time: '',
                vacancies_ids: [],
            });
        }
        if (errors?.error) {
            toast.error(errors.error);
        }
    }, [success, errors]);

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchPeriods(page, perPage);
    };

    const handlePerPageChange = (itemsPerPage: number) => {
        setPerPage(itemsPerPage);
        fetchPeriods(currentPage, itemsPerPage);
    };

    // Search handler
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Period selection handler - Navigate to administration page with selected period and company
    // const handleSelectPeriod = (periodId: string) => {
    //     // Store the selected period ID in localStorage
    //     setSelectedPeriodId(periodId);
        
    //     // Get company ID from props if available, otherwise use a default value
    //     const companyIdParam = company ? `&company=${company.id}` : '';
        
    //     // Navigate to administration page with the period ID and company ID as parameters
    //     router.visit(`/dashboard/company/administration?period=${periodId}${companyIdParam}`);
    // };

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

    // Update handleEditPeriod to use proper types
    const handleEditPeriod = (periodId: string) => {
        const period = periods.find(p => p.id === periodId);
        if (period) {
            setEditingPeriodId(periodId);
            setEditFormData({
                name: period.name,
                description: period.description,
                start_time: formatDateForInput(period.startTime),
                end_time: formatDateForInput(period.endTime),
                vacancies_ids: period.vacanciesList?.map(v => String(v.id)) || []
            });
            setIsEditDialogOpen(true);
        }
    };

    const handleCreatePeriod = () => {
        setIsLoading(true);
        router.post('/dashboard/periods', newPeriod, {
            onSuccess: () => {
                // Reset form and close dialog
                setNewPeriod({
                    name: '',
                    description: '',
                    start_time: '',
                    end_time: '',
                    vacancies_ids: [],
                });
                setIsAddPeriodDialogOpen(false);
                setIsLoading(false);
                // router.reload();
                router.visit(`/dashboard/companies/${company?.id}/periods`);
            },
            onError: () => {
                toast.error('Failed to create period. Please check all fields and try again.');
                setIsLoading(false);
            }
        });
    };

    const handleDeletePeriod = (periodId: string) => {
        setDeletingPeriodId(periodId);
        setIsDeleteDialogOpen(true);
    };
    
    const confirmDeletePeriod = () => {
        if (!deletingPeriodId) return;
        
        setIsLoading(true);
        router.delete(`/dashboard/periods/${deletingPeriodId}`, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setIsLoading(false);
                setDeletingPeriodId(null);
                router.visit(`/dashboard/companies/${company?.id}/periods`);
            },
            onError: () => {
                toast.error('Failed to delete period');
                setIsLoading(false);
                setDeletingPeriodId(null);
            }
        });
    };

    // Handle the update submission
    const handleUpdatePeriod = () => {
        if (!editingPeriodId) return;
        
        setIsLoading(true);
        const url = `/dashboard/periods/${editingPeriodId}`;
            
        router.put(url, editFormData, {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                setIsLoading(false);
                setEditingPeriodId(null);
                toast.success('Period updated successfully');
                
                // Redirect back to the correct company periods page if we're in company context
                if (company?.id) {
                    router.visit(`/dashboard/companies/${company.id}/periods`);
                } else {
                    router.visit('/dashboard/periods');
                }
            },
            onError: () => {
                toast.error('Failed to update period. Please check all fields and try again.');
                setIsLoading(false);
            },
            preserveScroll: true
        });
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
                                pagination={{
                                    total: defaultPagination.total,
                                    current_page: currentPage,
                                    per_page: perPage,
                                    last_page: defaultPagination.last_page,
                                }}
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
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Period</DialogTitle>
                        <DialogDescription>
                            Fill in the details to create a new period
                        </DialogDescription>
                    </DialogHeader>

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

                    <DialogFooter>
                        <Button
                            onClick={() => setIsAddPeriodDialogOpen(false)}
                            variant="outline"
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreatePeriod}
                            disabled={isLoading}
                            type="submit"
                        >
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
                        <DialogDescription>
                            Update the period details
                        </DialogDescription>
                    </DialogHeader>

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
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                placeholder="Enter period name"
                                className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Description Field */}
                        <div className="relative">
                            <label htmlFor="edit-description" className="absolute top-2 left-3 text-sm text-blue-500">
                                Description
                            </label>
                            <textarea
                                id="edit-description"
                                name="description"
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                placeholder="Enter period description"
                                className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                rows={3}
                            />
                        </div>

                        {/* Start Time Field */}
                        <div className="relative">
                            <label htmlFor="edit-start-time" className="absolute top-2 left-3 text-sm text-blue-500">
                                Start Time
                            </label>
                            <input
                                id="edit-start-time"
                                name="start_time"
                                type="date"
                                value={editFormData.start_time}
                                onChange={(e) => setEditFormData({...editFormData, start_time: e.target.value})}
                                className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* End Time Field */}
                        <div className="relative">
                            <label htmlFor="edit-end-time" className="absolute top-2 left-3 text-sm text-blue-500">
                                End Time
                            </label>
                            <input
                                id="edit-end-time"
                                name="end_time"
                                type="date"
                                value={editFormData.end_time}
                                onChange={(e) => setEditFormData({...editFormData, end_time: e.target.value})}
                                className="w-full rounded-md border border-blue-500 px-3 pt-6 pb-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Vacancies Field */}
                        <div className="space-y-2">
                            <Label className="text-sm text-blue-500">Vacancies</Label>
                            <div className="space-y-2">
                                {vacancies.map((vacancy) => (
                                    <div key={vacancy.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`vacancy-${vacancy.id}`}
                                            checked={editFormData.vacancies_ids.includes(String(vacancy.id))}
                                            onCheckedChange={(checked) => {
                                                setEditFormData({
                                                    ...editFormData,
                                                    vacancies_ids: checked
                                                        ? [...editFormData.vacancies_ids, String(vacancy.id)]
                                                        : editFormData.vacancies_ids.filter(id => id !== String(vacancy.id))
                                                });
                                            }}
                                        />
                                        <Label htmlFor={`vacancy-${vacancy.id}`} className="text-sm">
                                            {vacancy.title} - {vacancy.department}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdatePeriod}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Update Period'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Period Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Period Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about the selected period
                        </DialogDescription>
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
                        <Button 
                            onClick={() => setIsViewDialogOpen(false)}
                            type="button"
                        >
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

