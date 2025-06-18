import { AssessmentTable, type AssessmentUser } from '@/components/company-table-assessment';
import { CompanyWizard } from '@/components/company-wizard';
import { SearchBar } from '@/components/searchbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePeriodCompanyInfo } from '@/hooks/usePeriodCompanyInfo';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Filter, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface AssessmentManagementProps {
    users?: AssessmentUser[];
    pagination?: PaginationData;
    selectedPeriod?: {
        id: string;
        name: string;
        company?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Assessment Management',
        href: '/dashboard/assessment',
    },
];

const positions = [
    { value: 'ui_ux', label: 'UI / UX' },
    { value: 'back_end', label: 'Back End' },
    { value: 'front_end', label: 'Front End' },
    { value: 'ux_writer', label: 'UX Writer' },
    { value: 'it_spesialis', label: 'IT Spesialis' },
];

// Dummy data untuk assessment (updated without cv, status, score)
const dummyAssessmentUsers: AssessmentUser[] = [
    {
        id: '1',
        name: 'Rizal Farhan Nanda',
        email: 'Rizalfarhananda@gmail.com',
        position: 'UI / UX',
        registration_date: '2025-03-20',
        periodId: '1',
        vacancy: 'UI/UX Designer'
    },
    {
        id: '2',
        name: 'M. Hassan Naufal Zayyan',
        email: 'Rizalfarhananda@gmail.com',
        position: 'Back End',
        registration_date: '2025-03-18',
        periodId: '1',
        vacancy: 'Backend Developer'
    },
    {
        id: '3',
        name: 'Ardan Ferdiansah',
        email: 'Rizalfarhananda@gmail.com',
        position: 'Front End',
        registration_date: '2025-03-18',
        periodId: '1',
        vacancy: 'Frontend Developer'
    },
    {
        id: '4',
        name: 'Muhammad Ridwan',
        email: 'Rizalfarhananda@gmail.com',
        position: 'UX Writer',
        registration_date: '2025-03-20',
        periodId: '1',
        vacancy: 'UX Writer'
    },
    {
        id: '5',
        name: 'Untara Eka Saputra',
        email: 'Rizalfarhananda@gmail.com',
        position: 'IT Spesialis',
        registration_date: '2025-03-22',
        periodId: '1',
        vacancy: 'IT Specialist'
    },
    {
        id: '6',
        name: 'Dea Derika Winahyu',
        email: 'Rizalfarhananda@gmail.com',
        position: 'UX Writer',
        registration_date: '2025-03-20',
        periodId: '1',
        vacancy: 'UX Writer'
    },
    {
        id: '7',
        name: 'Kartika Yuliana',
        email: 'Rizalfarhananda@gmail.com',
        position: 'IT Spesialis',
        registration_date: '2025-03-22',
        periodId: '1',
        vacancy: 'IT Specialist'
    },
    {
        id: '8',
        name: 'Ayesha Dear Raisha',
        email: 'Rizalfarhananda@gmail.com',
        position: 'UX Writer',
        registration_date: '2025-03-20',
        periodId: '1',
        vacancy: 'UX Writer'
    }
];

export default function AssessmentManagement({ 
    users: initialUsers = [], 
    pagination: initialPagination,
    selectedPeriod
}: AssessmentManagementProps) {
    // State for filtering
    const [filteredUsers, setFilteredUsers] = useState<AssessmentUser[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [positionFilter, setPositionFilter] = useState<string>('');

    // Get period ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const periodId = urlParams.get('period');
    const companyIdFromUrl = urlParams.get('company');
    
    // Fetch period and company info from the API
    const { loading, error, periodInfo } = usePeriodCompanyInfo(periodId, companyIdFromUrl);
    
    // State for company and period names (either from API or fallback)
    const [companyName, setCompanyName] = useState<string>("Loading...");
    const [periodName, setPeriodName] = useState<string>("Loading...");
    
    // Update company and period names when periodInfo changes
    useEffect(() => {
        if (periodInfo) {
            setCompanyName(periodInfo.company.name);
            setPeriodName(periodInfo.period.name);
        } else if (!loading && !error && !periodInfo) {
            // Fallback if no period is selected
            setCompanyName("Select a period");
            setPeriodName("No period selected");
        } else if (error) {
            setCompanyName("Error loading data");
            setPeriodName("Error loading data");
        }
    }, [periodInfo, loading, error]);

    // Use dummy data if no props provided
    const users = initialUsers.length > 0 ? initialUsers : dummyAssessmentUsers;
    const [pagination, setPagination] = useState<PaginationData>(
        initialPagination || {
            total: 42,
            per_page: 10,
            current_page: 2,
            last_page: 5,
        }
    );

    const [isLoading, setIsLoading] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AssessmentUser | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [positionFilterState, setPositionFilterState] = useState('all');
    const [isFilterActive, setIsFilterActive] = useState(false);

    const fetchUsers = useCallback(
        async (page = 1, perPage = pagination.per_page) => {
            setIsLoading(true);
            try {
                updateUrlParams(page, perPage);

                // Simulate API call with dummy data
                setTimeout(() => {
                    setFilteredUsers(dummyAssessmentUsers);
                    setPagination({
                        total: 42,
                        per_page: perPage,
                        current_page: page,
                        last_page: Math.ceil(42 / perPage)
                    });
                    setIsLoading(false);
                }, 500);
            } catch (error) {
                console.error('Error fetching assessment data:', error);
                setIsLoading(false);
            }
        },
        [pagination.per_page],
    );

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') ? parseInt(urlParams.get('page')!) : 2;
        const perPage = urlParams.get('per_page') ? parseInt(urlParams.get('per_page')!) : 10;

        if (page !== pagination.current_page || perPage !== pagination.per_page) {
            fetchUsers(page, perPage);
        }
    }, [fetchUsers, pagination.current_page, pagination.per_page]);

    // Apply filters whenever filter states change
    useEffect(() => {
        let result = users;

        // Apply search filter
        if (searchQuery) {
            result = result.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.position.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Apply position filter
        if (positionFilterState && positionFilterState !== 'all') {
            result = result.filter((user) => user.position === positionFilterState);
        }

        setFilteredUsers(result);

        // Set filter active state
        setIsFilterActive(searchQuery !== '' || positionFilterState !== 'all');
    }, [searchQuery, positionFilterState, users]);

    // Function to update URL parameters without page refresh
    const updateUrlParams = (page: number, perPage: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page.toString());
        url.searchParams.set('per_page', perPage.toString());
        window.history.pushState({}, '', url.toString());
    };

    const handlePageChange = (page: number) => {
        fetchUsers(page, pagination.per_page);
    };

    const handlePerPageChange = (perPage: number) => {
        fetchUsers(1, perPage);
    };

    const handleViewUser = (userId: string) => {
        // Navigate to assessment detail page instead of opening dialog
        router.visit(`/dashboard/assessment/detail/${userId}`);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setPositionFilterState('all');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assessment Management" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <h2 className="text-2xl font-semibold text-center mb-4">Assessment Management</h2>
                    
                    {/* Centered wizard navigation for all screen sizes */}
                    <div className="mb-6">
                        <CompanyWizard currentStep="assessment" className="!mb-0 !shadow-none !bg-transparent !border-0" />
                    </div>
                    
                    <Card>
                        <CardHeader className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <CardTitle>
                                    {loading ? "Loading..." : error ? "Error loading data" : companyName}
                                </CardTitle>
                                <CardDescription>
                                    {loading ? "Loading period information..." : 
                                     error ? "Could not load period information" : (
                                        <>
                                            Manage candidate assessments for {periodName} recruitment period
                                            {periodInfo?.period.start_date && periodInfo?.period.end_date && (
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {new Date(periodInfo.period.start_date).toLocaleDateString()} - {new Date(periodInfo.period.end_date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </>
                                     )}
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-4">
                                <SearchBar
                                    icon={<Search className="h-4 w-4" />}
                                    placeholder="Cari kandidat..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={isFilterActive ? 'default' : 'outline'} size="icon" className="relative">
                                            <Filter className="h-4 w-4" />
                                            {isFilterActive && <span className="bg-primary absolute -top-1 -right-1 h-2 w-2 rounded-full"></span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="font-inter w-80">
                                        <div className="space-y-4">
                                            <h4 className="font-inter font-medium text-gray-900">Filters</h4>
                                            <div className="space-y-2">
                                                <Label htmlFor="position-filter" className="font-inter text-sm text-gray-700">
                                                    Position
                                                </Label>
                                                <Select value={positionFilterState} onValueChange={setPositionFilterState}>
                                                    <SelectTrigger id="position-filter" className="font-inter">
                                                        <SelectValue placeholder="Filter by position" className="font-inter" />
                                                    </SelectTrigger>
                                                    <SelectContent className="font-inter">
                                                        <SelectItem
                                                            value="all"
                                                            className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                        >
                                                            All Positions
                                                        </SelectItem>
                                                        {positions.map((position) => (
                                                            <SelectItem
                                                                key={position.value}
                                                                value={position.label}
                                                                className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                            >
                                                                {position.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button variant="outline" size="sm" onClick={resetFilters} className="font-inter text-xs">
                                                    Reset Filters
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <AssessmentTable
                                users={filteredUsers}
                                pagination={pagination}
                                onView={handleViewUser}
                                onPageChange={handlePageChange}
                                onPerPageChange={handlePerPageChange}
                                isLoading={isLoading}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}