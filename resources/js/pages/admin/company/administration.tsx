import { AssessmentTable, type AssessmentUser } from '@/components/company-table-administration';
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
import { useEffect, useMemo, useState } from 'react';

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
    // Extended dummy data for testing all features
    const [allUsers] = useState<AssessmentUser[]>(initialUsers.length > 0 ? initialUsers : [
        // Q1 2025 Recruitment - Period 1
        {
            id: '01',
            name: 'Rizal Farhan Nanda',
            email: 'rizalfarhannanda@gmail.com',
            position: 'UI / UX',
            registration_date: '2025-03-20',
            cv: {
                filename: 'rizal_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/rizal_cv.pdf'
            },
            periodId: '1',
            vacancy: 'UI/UX Designer',
        },
        {
            id: '02',
            name: 'M. Hassan Naufal Zayyan',
            email: 'hassan@example.com',
            position: 'Back End',
            registration_date: '2025-03-18',
            cv: {
                filename: 'hassan_resume.jpg',
                fileType: 'jpg',
                url: '/uploads/cv/hassan_resume.jpg'
            },
            periodId: '1',
            vacancy: 'Back End Developer',
        },
        {
            id: '03',
            name: 'Ardan Ferdiansah',
            email: 'ardan@example.com',
            position: 'Front End',
            registration_date: '2025-03-18',
            cv: {
                filename: 'ardan_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/ardan_cv.pdf'
            },
            periodId: '1',
            vacancy: 'Front End Developer',
        },
        {
            id: '04',
            name: 'Muhammad Ridwan',
            email: 'ridwan@example.com',
            position: 'UX Writer',
            registration_date: '2025-03-20',
            cv: {
                filename: 'ridwan_resume.png',
                fileType: 'png',
                url: '/uploads/cv/ridwan_resume.png'
            },
            periodId: '1',
            vacancy: 'UX Writer',
        },
        {
            id: '05',
            name: 'Untara Eka Saputra',
            email: 'untara@example.com',
            position: 'IT Spesialis',
            registration_date: '2025-03-22',
            cv: {
                filename: 'untara_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/untara_cv.pdf'
            },
            periodId: '1',
            vacancy: 'IT Specialist',
        },
        {
            id: '06',
            name: 'Dea Derika Winahyu',
            email: 'dea@example.com',
            position: 'UX Writer',
            registration_date: '2025-03-20',
            cv: {
                filename: 'dea_resume.jpg',
                fileType: 'jpg',
                url: '/uploads/cv/dea_resume.jpg'
            },
            periodId: '1',
            vacancy: 'UX Writer',
        },
        {
            id: '07',
            name: 'Kartika Yuliana',
            email: 'kartika@example.com',
            position: 'IT Spesialis',
            registration_date: '2025-03-22',
            cv: {
                filename: 'kartika_cv.png',
                fileType: 'png',
                url: '/uploads/cv/kartika_cv.png'
            },
            periodId: '1',
            vacancy: 'IT Specialist',
        },
        {
            id: '08',
            name: 'Ayesha Dear Raisha',
            email: 'ayesha@example.com',
            position: 'UX Writer',
            registration_date: '2025-03-20',
            cv: {
                filename: 'ayesha_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/ayesha_cv.pdf'
            },
            periodId: '1',
            vacancy: 'UX Writer',
        },
        {
            id: '09',
            name: 'Ahmad Fajar Prakoso',
            email: 'fajar.prakoso@gmail.com',
            position: 'Full Stack',
            registration_date: '2025-03-25',
            cv: {
                filename: 'fajar_fullstack_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/fajar_fullstack_cv.pdf'
            },
            periodId: '1',
            vacancy: 'Full Stack Developer',
        },
        {
            id: '10',
            name: 'Siti Nurhaliza',
            email: 'siti.nurhaliza@company.co.id',
            position: 'UI / UX',
            registration_date: '2025-03-24',
            cv: {
                filename: 'siti_portfolio.jpg',
                fileType: 'jpg',
                url: '/uploads/cv/siti_portfolio.jpg'
            },
            periodId: '1',
            vacancy: 'Senior UI/UX Designer',
        },
        {
            id: '11',
            name: 'Budi Santoso',
            email: 'budi.santoso@tech.com',
            position: 'DevOps',
            registration_date: '2025-03-23',
            cv: {
                filename: 'budi_devops_resume.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/budi_devops_resume.pdf'
            },
            periodId: '1',
            vacancy: 'DevOps Engineer',
        },
        {
            id: '12',
            name: 'Rina Marlina',
            email: 'rina.marlina@design.co',
            position: 'UI / UX',
            registration_date: '2025-03-26',
            cv: {
                filename: 'rina_design_cv.png',
                fileType: 'png',
                url: '/uploads/cv/rina_design_cv.png'
            },
            periodId: '1',
            vacancy: 'UI/UX Designer',
        },
        
        // Q2 2025 Recruitment - Period 2
        {
            id: '13',
            name: 'David Kurniawan',
            email: 'david.kurniawan@outlook.com',
            position: 'Data Scientist',
            registration_date: '2025-06-15',
            cv: {
                filename: 'david_datascience_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/david_datascience_cv.pdf'
            },
            periodId: '2',
            vacancy: 'Senior Data Scientist',
        },
        {
            id: '14',
            name: 'Indira Sari',
            email: 'indira.sari@analytics.com',
            position: 'Data Analyst',
            registration_date: '2025-06-12',
            cv: {
                filename: 'indira_analyst_resume.jpg',
                fileType: 'jpg',
                url: '/uploads/cv/indira_analyst_resume.jpg'
            },
            periodId: '2',
            vacancy: 'Data Analyst',
        },
        {
            id: '15',
            name: 'Fauzan Adhima',
            email: 'fauzan.adhima@mobile.dev',
            position: 'Mobile Developer',
            registration_date: '2025-06-18',
            cv: {
                filename: 'fauzan_mobile_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/fauzan_mobile_cv.pdf'
            },
            periodId: '2',
            vacancy: 'React Native Developer',
        },
        {
            id: '16',
            name: 'Maya Putri',
            email: 'maya.putri@flutter.dev',
            position: 'Mobile Developer',
            registration_date: '2025-06-20',
            cv: {
                filename: 'maya_flutter_portfolio.png',
                fileType: 'png',
                url: '/uploads/cv/maya_flutter_portfolio.png'
            },
            periodId: '2',
            vacancy: 'Flutter Developer',
        },
        {
            id: '17',
            name: 'Rahmat Hidayat',
            email: 'rahmat.hidayat@security.net',
            position: 'Security Engineer',
            registration_date: '2025-06-14',
            cv: {
                filename: 'rahmat_security_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/rahmat_security_cv.pdf'
            },
            periodId: '2',
            vacancy: 'Cybersecurity Specialist',
        },
        {
            id: '18',
            name: 'Lestari Wulandari',
            email: 'lestari.wulandari@qa.com',
            position: 'QA Engineer',
            registration_date: '2025-06-16',
            cv: {
                filename: 'lestari_qa_resume.jpg',
                fileType: 'jpg',
                url: '/uploads/cv/lestari_qa_resume.jpg'
            },
            periodId: '2',
            vacancy: 'QA Automation Engineer',
        },
        {
            id: '19',
            name: 'Agus Setiawan',
            email: 'agus.setiawan@backend.dev',
            position: 'Back End',
            registration_date: '2025-06-17',
            cv: {
                filename: 'agus_backend_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/agus_backend_cv.pdf'
            },
            periodId: '2',
            vacancy: 'Senior Backend Developer',
        },
        {
            id: '20',
            name: 'Nurul Fadhilah',
            email: 'nurul.fadhilah@frontend.co',
            position: 'Front End',
            registration_date: '2025-06-19',
            cv: {
                filename: 'nurul_frontend_portfolio.png',
                fileType: 'png',
                url: '/uploads/cv/nurul_frontend_portfolio.png'
            },
            periodId: '2',
            vacancy: 'Senior Frontend Developer',
        },
        {
            id: '21',
            name: 'Bayu Aji Pamungkas',
            email: 'bayu.aji@cloud.engineer',
            position: 'Cloud Engineer',
            registration_date: '2025-06-21',
            cv: {
                filename: 'bayu_cloud_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/bayu_cloud_cv.pdf'
            },
            periodId: '2',
            vacancy: 'AWS Cloud Engineer',
        },
        {
            id: '22',
            name: 'Putri Maharani',
            email: 'putri.maharani@product.manager',
            position: 'Product Manager',
            registration_date: '2025-06-13',
            cv: {
                filename: 'putri_pm_resume.jpg',
                fileType: 'jpg',
                url: '/uploads/cv/putri_pm_resume.jpg'
            },
            periodId: '2',
            vacancy: 'Senior Product Manager',
        },
        
        // Additional candidates for different positions - Period 1
        {
            id: '23',
            name: 'Wahyu Ramadhan',
            email: 'wahyu.ramadhan@tech.startup',
            position: 'Full Stack',
            registration_date: '2025-03-28',
            cv: {
                filename: 'wahyu_fullstack_portfolio.png',
                fileType: 'png',
                url: '/uploads/cv/wahyu_fullstack_portfolio.png'
            },
            periodId: '1',
            vacancy: 'Full Stack Developer',
        },
        {
            id: '24',
            name: 'Dewi Sartika',
            email: 'dewi.sartika@content.writer',
            position: 'UX Writer',
            registration_date: '2025-03-27',
            cv: {
                filename: 'dewi_writer_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/dewi_writer_cv.pdf'
            },
            periodId: '1',
            vacancy: 'Senior UX Writer',
        },
        {
            id: '25',
            name: 'Eko Prasetyo',
            email: 'eko.prasetyo@system.admin',
            position: 'IT Spesialis',
            registration_date: '2025-03-29',
            cv: {
                filename: 'eko_sysadmin_resume.jpg',
                fileType: 'jpg',
                url: '/uploads/cv/eko_sysadmin_resume.jpg'
            },
            periodId: '1',
            vacancy: 'System Administrator',
        },
        {
            id: '26',
            name: 'Fitri Handayani',
            email: 'fitri.handayani@blockchain.dev',
            position: 'Blockchain Developer',
            registration_date: '2025-03-30',
            cv: {
                filename: 'fitri_blockchain_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/fitri_blockchain_cv.pdf'
            },
            periodId: '1',
            vacancy: 'Blockchain Developer',
        },
        {
            id: '27',
            name: 'Galih Permana',
            email: 'galih.permana@ai.engineer',
            position: 'AI Engineer',
            registration_date: '2025-03-31',
            cv: {
                filename: 'galih_ai_portfolio.png',
                fileType: 'png',
                url: '/uploads/cv/galih_ai_portfolio.png'
            },
            periodId: '1',
            vacancy: 'AI/ML Engineer',
        },
        
        // Q3 2025 Recruitment - Period 3
        {
            id: '28',
            name: 'Hendra Wijaya',
            email: 'hendra.wijaya@senior.dev',
            position: 'Tech Lead',
            registration_date: '2025-09-10',
            cv: {
                filename: 'hendra_techlead_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/hendra_techlead_cv.pdf'
            },
            periodId: '3',
            vacancy: 'Technical Lead',
        },
        {
            id: '29',
            name: 'Ira Suryani',
            email: 'ira.suryani@scrum.master',
            position: 'Scrum Master',
            registration_date: '2025-09-12',
            cv: {
                filename: 'ira_scrum_resume.jpg',
                fileType: 'jpg',
                url: '/uploads/cv/ira_scrum_resume.jpg'
            },
            periodId: '3',
            vacancy: 'Agile Scrum Master',
        },
        {
            id: '30',
            name: 'Joko Susilo',
            email: 'joko.susilo@architecture.lead',
            position: 'Solution Architect',
            registration_date: '2025-09-15',
            cv: {
                filename: 'joko_architect_cv.pdf',
                fileType: 'pdf',
                url: '/uploads/cv/joko_architect_cv.pdf'
            },
            periodId: '3',
            vacancy: 'Senior Solution Architect',
        },
    ]);

    // State management
    const [isLoading, setIsLoading] = useState(false);

    // Redirect ke halaman detail administration
    const handleViewUser = (userId: string) => {
        router.visit(`/dashboard/administration/${userId}`);
    };

    // Filter and search state - removed period-related states
    const [searchQuery, setSearchQuery] = useState('');
    const [positionFilter, setPositionFilter] = useState('all');
    const [isFilterActive, setIsFilterActive] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filtered users based on search and filters - removed period filter
    const filteredUsers = useMemo(() => {
        let result = allUsers;

        // Apply search filter
        if (searchQuery) {
            result = result.filter(
                (user) =>
                    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.vacancy.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Apply position filter
        if (positionFilter !== 'all') {
            result = result.filter((user) => user.position.toLowerCase() === positionFilter.toLowerCase());
        }

        return result;
    }, [allUsers, searchQuery, positionFilter]);

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

    // Update filter active state - removed selectedPeriod
    useEffect(() => {
        setIsFilterActive(searchQuery !== '' || positionFilter !== 'all');
    }, [searchQuery, positionFilter]);

    // Reset current page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, positionFilter]);

    // Reset filters function - removed period filter
    const resetFilters = () => {
        setSearchQuery('');
        setPositionFilter('all');
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (perPage: number) => {
        setItemsPerPage(perPage);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Get unique positions for filter
    const uniquePositions = Array.from(new Set(allUsers.map(user => user.position)));

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
                    <h2 className="text-2xl font-semibold text-center mb-4">Administration</h2>
                    
                    {/* Centered wizard navigation for all screen sizes */}
                    <div className="mb-6">
                        <CompanyWizard currentStep="administration" className="!mb-0 !shadow-none !bg-transparent !border-0" />
                    </div>
                    
                    <Card>
                        <CardHeader className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <CardTitle>
                                    {companyName}
                                </CardTitle>
                                <CardDescription>
                                    {periodName ? (
                                        <>
                                            Manage candidates for {periodName} recruitment period
                                            {fetchedPeriodInfo?.period?.start_date && fetchedPeriodInfo?.period?.end_date && (
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {new Date(fetchedPeriodInfo.period.start_date).toLocaleDateString()} - {new Date(fetchedPeriodInfo.period.end_date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </>
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
                                        <Button variant={isFilterActive ? 'default' : 'outline'} size="icon" className="relative">
                                            <Filter className="h-4 w-4" />
                                            {isFilterActive && <span className="bg-primary absolute -top-1 -right-1 h-2 w-2 rounded-full"></span>}
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
