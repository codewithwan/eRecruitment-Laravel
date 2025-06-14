import { SearchBar } from '@/components/searchbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { AlertTriangle, Building2, Edit, Filter, Mail, MapPin, Phone, Plus, Search, Trash2 } from 'lucide-react';
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
        title: 'Company Management',
        href: '/dashboard/company-management',
    },
];

export default function CompanyManagement({ companies }: Props) {
    // Filter and search state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (company: Company) => {
        setCompanyToDelete(company);
    };

    const handleDeleteConfirm = async () => {
        if (!companyToDelete) return;
        
        setIsDeleting(true);
        try {
            router.delete(route('companies.destroy', companyToDelete.id), {
                onFinish: () => {
                    setIsDeleting(false);
                    setCompanyToDelete(null);
                }
            });
        } catch (error) {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setCompanyToDelete(null);
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
            <Head title="Company Management" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Company Management</h2>
                    </div>
                    
                    {/* Delete Confirmation Dialog */}
                    <Dialog open={!!companyToDelete} onOpenChange={(open) => !open && handleDeleteCancel()}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                    Confirm Deletion
                                </DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete <strong>{companyToDelete?.name}</strong>? 
                                    This action cannot be undone and will permanently remove all associated data.
                                </DialogDescription>
                            </DialogHeader>

                            <DialogFooter>
                                <Button 
                                    variant="outline" 
                                    onClick={handleDeleteCancel}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    onClick={handleDeleteConfirm}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Company
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    
                    <Card>
                        <CardHeader className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <CardTitle>Company Management</CardTitle>
                                <CardDescription>Create, read, update, and delete companies</CardDescription>
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
                                                        <SelectItem value="all">All Companies</SelectItem>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
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

                                <Link href={route('companies.create')}>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Company
                                    </Button>
                                </Link>
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
                                                    <div className="flex space-x-1">
                                                        <Link href={route('companies.edit', company.id)}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(company)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
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
                                            : 'Get started by creating a new company.'
                                        }
                                    </p>
                                    {!searchQuery && (
                                        <div className="mt-6">
                                            <Link href={route('companies.create')}>
                                                <Button>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add First Company
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}