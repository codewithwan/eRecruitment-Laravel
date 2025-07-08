import { SearchBar } from '@/components/searchbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { Building2, Eye, Filter, Mail, MapPin, Phone, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Company {
    id: number;
    name: string;
    description?: string;
    email?: string;
    phone?: string;
    address?: string;
    created_at: string;
}

interface Props {
    companies: Company[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Companies',
        href: '/dashboard/companies',
    },
];

export default function CompaniesIndex({ companies }: Props) {
    // Filter and search state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFilterActive, setIsFilterActive] = useState(false);

    const handleViewPeriods = (company: Company) => {
        
        router.get(route('companies.periods', company.id));
    };

    // Filtered companies based on search
    const filteredCompanies = useMemo(() => {
        let result = companies;

        // Apply search filter
        if (searchQuery) {
            result = result.filter(
                (company) =>
                    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (company.email && company.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (company.description && company.description.toLowerCase().includes(searchQuery.toLowerCase())),
            );
        }

        return result;
    }, [companies, searchQuery]);

    // Update filter active state
    useEffect(() => {
        setIsFilterActive(searchQuery !== '' || statusFilter !== 'all');
    }, [searchQuery, statusFilter]);

    // Reset filters function
    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies Management" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Companies</h2>
                    </div>
                    
                    <Card>
                        <CardHeader className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <CardTitle>Companies Periods</CardTitle>
                                <CardDescription>View companies and their recruitment periods</CardDescription>
                            </div>

                            <div className="flex items-center gap-4">
                                <SearchBar
                                    icon={<Search className="h-4 w-4" />}
                                    placeholder="Cari perusahaan..."
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                />

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={isFilterActive ? 'default' : 'outline'} size="icon" className="relative">
                                            <Filter className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="font-inter w-80">
                                        <div className="space-y-4">
                                            <h4 className="font-inter font-medium text-gray-900">Filters</h4>
                                            <div className="space-y-2">
                                                <Label htmlFor="status-filter" className="font-inter text-sm text-gray-700">
                                                    Status
                                                </Label>
                                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                    <SelectTrigger id="status-filter" className="font-inter">
                                                        <SelectValue placeholder="Filter by status" className="font-inter" />
                                                    </SelectTrigger>
                                                    <SelectContent className="font-inter">
                                                        <SelectItem
                                                            value="all"
                                                            className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                        >
                                                            All Companies
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="active"
                                                            className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                        >
                                                            Active
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="inactive"
                                                            className="font-inter cursor-pointer text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600"
                                                        >
                                                            Inactive
                                                        </SelectItem>
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
                            {filteredCompanies.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredCompanies.map((company) => (
                                        <Card key={company.id} className="relative">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-lg">{company.name}</h3>
                                                        <Badge variant="outline" className="mt-1">
                                                            Active
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {company.description && (
                                                    <p className="text-sm text-gray-600 mt-2">{company.description}</p>
                                                )}
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2 text-sm">
                                                    {company.email && (
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-600">{company.email}</span>
                                                        </div>
                                                    )}
                                                    {company.phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-600">{company.phone}</span>
                                                        </div>
                                                    )}
                                                    {company.address && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-600 line-clamp-2">{company.address}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="mt-4 pt-4 border-t">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewPeriods(company)}
                                                        className="w-full"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Periods
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        {searchQuery ? 'No companies found' : 'No companies'}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchQuery 
                                            ? 'Try adjusting your search terms or filters.'
                                            : 'No companies available to display.'
                                        }
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}