import { AssessmentTable, type AssessmentUser } from '@/components/company-table-administration';
import { CompanyWizard } from '@/components/company-wizard';
import { SearchBar } from '@/components/searchbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePeriodCompanyInfo } from '@/hooks/usePeriodCompanyInfo';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Filter, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Period = {
    id: number;
    name: string;
};

interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface AdministrationProps {
    users?: AssessmentUser[];
    pagination?: PaginationData;
    companyId?: number;
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
        title: 'Administration',
        href: '/dashboard/administration',
    },
];

export default function AdministrationDashboard({ 
    users: initialUsers = [],
    pagination: initialPagination,
    companyId = 1,
    selectedPeriod
}: AdministrationProps) {
    // State management
    const [isLoading, setIsLoading] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AssessmentUser | null>(null);

    // Filter and search state
    const [searchQuery, setSearchQuery] = useState('');
    const [positionFilter, setPositionFilter] = useState('all');

    const filteredUsers = useMemo(() => {
        return initialUsers.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (positionFilter === 'all' || user.position === positionFilter)
        );
    }, [initialUsers, searchQuery, positionFilter]);

    // Redirect ke halaman detail administration
    const handleViewUser = (userId: string) => {
        router.visit(`/dashboard/administration/${userId}`);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setPositionFilter('all');
    };

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Paginated users for current page
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, currentPage, itemsPerPage]);

    // Pagination data
    const pagination = useMemo(() => ({
        total: filteredUsers.length,
        per_page: itemsPerPage,
        current_page: currentPage,
        last_page: Math.ceil(filteredUsers.length / itemsPerPage) || 1,
    }), [filteredUsers.length, itemsPerPage, currentPage]);

    // Get unique positions for filter
    const uniquePositions = Array.from(new Set(initialUsers.map(user => user.position)));

    // Get period info from URL parameters or props
    const [periodInfo, setPeriodInfo] = useState<{
        name: string;
        company: string;
    } | null>(null);

    // Get period ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const periodId = urlParams.get('period');
    const companyIdFromUrl = urlParams.get('company');
    
    // Use company ID from URL if available, otherwise use the one from props
    const effectiveCompanyId = companyIdFromUrl || (companyId ? String(companyId) : null);
    
    // Fetch period and company info from the API
    const { loading, error, periodInfo: fetchedPeriodInfo } = usePeriodCompanyInfo(periodId, effectiveCompanyId);
    
    // State for company and period names (either from API or fallback)
    const [companyName, setCompanyName] = useState<string>("Loading...");
    const [periodName, setPeriodName] = useState<string>("Loading...");
    
    // Update company and period names when periodInfo changes
    useEffect(() => {
        if (fetchedPeriodInfo) {
            setCompanyName(fetchedPeriodInfo.company.name);
            setPeriodName(fetchedPeriodInfo.period.name);
        } else if (!loading && !error && !fetchedPeriodInfo) {
            // Fallback if no period is selected
            setCompanyName("Select a period");
            setPeriodName("No period selected");
        } else if (error) {
            setCompanyName("Error loading data");
            setPeriodName("Error loading data");
        }
    }, [fetchedPeriodInfo, loading, error]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Administration" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    {/* Header with company name and period dates */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold mb-2">
                            {companyName !== "Loading..." ? companyName : "Administration"}
                        </h2>
                        {fetchedPeriodInfo?.period?.start_date && fetchedPeriodInfo?.period?.end_date && (
                            <p className="text-sm text-gray-600">
                                {new Date(fetchedPeriodInfo.period.start_date).toLocaleDateString()} - {new Date(fetchedPeriodInfo.period.end_date).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                    
                    {/* Centered wizard navigation for all screen sizes with highlight */}
                    <div className="mb-6">
                        <CompanyWizard currentStep="administration" className="!mb-0 !shadow-none !bg-transparent !border-0" />
                    </div>
                    
                    <Card>
                        <CardHeader className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <CardDescription>
                                    {periodName && periodName !== "Loading..." && periodName !== "No period selected" ? (
                                        `Manage candidates for ${periodName} recruitment period`
                                    ) : (
                                        'Manage all administration in the system'
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
                                        <Button variant={positionFilter !== 'all' ? 'default' : 'outline'} size="icon" className="relative">
                                            <Filter className="h-4 w-4" />
                                            {positionFilter !== 'all' && <span className="bg-primary absolute -top-1 -right-1 h-2 w-2 rounded-full"></span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="font-inter w-80">
                                        <div className="space-y-4">
                                            <h4 className="font-inter font-medium text-gray-900">Filters</h4>
                                            
                                            {/* Position Filter */}
                                            <div className="space-y-2">
                                                <Label htmlFor="position-filter" className="font-inter text-sm text-gray-700">
                                                    Position
                                                </Label>
                                                <Select value={positionFilter} onValueChange={setPositionFilter}>
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
                                                        {uniquePositions.map((position) => (
                                                            <SelectItem
                                                                key={position}
                                                                value={position.toLowerCase()}
                                                                className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                            >
                                                                {position}
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
                                users={paginatedUsers}
                                pagination={pagination}
                                onView={handleViewUser}
                                onPageChange={setCurrentPage}
                                onPerPageChange={setItemsPerPage}
                                isLoading={isLoading}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
