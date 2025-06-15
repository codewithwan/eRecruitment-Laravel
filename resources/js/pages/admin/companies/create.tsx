import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Globe, Mail, MapPin, Phone, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Company Management',
        href: '/dashboard/company-management',
    },
    {
        title: 'Create Company',
        href: '/dashboard/companies/create',
    },
];

// Mock data untuk parent company - nanti bisa diambil dari props
const parentCompanyInfo = {
    name: "PT MITRA KARYA ANALITIKA GROUP",
    industry: "Importer & Distributor || Laboratory Supply - Health & Safety Equipment - Environmental ||",
    email: "cs.mitrakarya.analitika@gmail.com",
    phone: "(024)7641-1111",
    address: "Jl. Klipang Ruko Amsterdam No.9D, Sendangmulyo, Kec. Tembalang, Kota Semarang, Jawa Tengah 50272",
    website: "https://mikacares.co.id/",
    established: "2014",
};

export default function CreateCompany() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('companies.store'), {
            onSuccess: () => {
                // Redirect ke company management setelah berhasil create
                router.get(route('company-management.index'));
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Company" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={route('company-management.index')}>
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                            </Link>
                            <h2 className="text-2xl font-semibold">Create Company</h2>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* New Company Form */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Plus className="h-5 w-5 text-blue-600" />
                                    <CardTitle>Company Information</CardTitle>
                                </div>
                                <CardDescription>Enter the details for the new company</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Company Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter company name"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Enter company description"
                                            className={errors.description ? 'border-red-500' : ''}
                                            rows={3}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-600">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="company@example.com"
                                                className={errors.email ? 'border-red-500' : ''}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="+62 21 1234 5678"
                                                className={errors.phone ? 'border-red-500' : ''}
                                            />
                                            {errors.phone && (
                                                <p className="text-sm text-red-600">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Complete company address"
                                            className={errors.address ? 'border-red-500' : ''}
                                            rows={3}
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-red-600">{errors.address}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end items-center space-x-2 pt-6">
                                        <Link href={route('company-management.index')}>
                                            <Button variant="outline" type="button">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Creating...' : 'Create Company'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Parent Company Information Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                    <CardTitle>Parent Company Information</CardTitle>
                                </div>
                                <CardDescription>
                                    This subsidiary will be created under the following parent company
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{parentCompanyInfo.name}</p>
                                            <Badge variant="secondary" className="mt-1">
                                                {parentCompanyInfo.industry}
                                            </Badge>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Mail className="mt-0.5 h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Email</p>
                                                <p className="text-sm text-gray-600">{parentCompanyInfo.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Phone className="mt-0.5 h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Phone</p>
                                                <p className="text-sm text-gray-600">{parentCompanyInfo.phone}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Globe className="mt-0.5 h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Website</p>
                                                <a 
                                                    href={parentCompanyInfo.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    {parentCompanyInfo.website}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Address</p>
                                                <p className="text-sm text-gray-600">{parentCompanyInfo.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Established</p>
                                            <p className="text-sm text-muted-foreground">{parentCompanyInfo.established}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}