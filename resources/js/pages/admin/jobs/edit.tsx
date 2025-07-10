import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface JobProps {
    job: {
        id: number;
        title: string;
        department_id: number;
        major_id?: number;
        location: string;
        salary?: string;
        company_id: number;
        requirements: string[] | string;
        benefits?: string[] | string;
        question_pack_id?: number;
        education_level_id?: number;
        vacancy_type_id: number;
        job_description?: string;
    };
    companies: { id: number; name: string }[];
    departments: { id: number; name: string }[];
    majors: { id: number; name: string }[];
    questionPacks: { id: number; pack_name: string }[];
    educationLevels: { id: number; name: string }[];
    vacancyTypes: { id: number; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Job Management',
        href: '/dashboard/jobs',
    },
    {
        title: 'Edit Job',
        href: '#',
    },
];

export default function EditJob({ job, companies, departments, majors, questionPacks, educationLevels, vacancyTypes }: JobProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: job.title,
        department_id: String(job.department_id),
        major_id: job.major_id ? String(job.major_id) : 'none',
        location: job.location,
        salary: job.salary || '',
        company_id: String(job.company_id),
        requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements || '',
        benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : job.benefits || '',
        question_pack_id: job.question_pack_id ? String(job.question_pack_id) : 'none',
        education_level_id: job.education_level_id ? String(job.education_level_id) : 'none',
        vacancy_type_id: String(job.vacancy_type_id),
        job_description: job.job_description || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const requirementsArray = formData.requirements.split('\n').filter((req) => req.trim() !== '');
            const benefitsArray = formData.benefits ? formData.benefits.split('\n').filter((ben) => ben.trim() !== '') : [];

            if (requirementsArray.length === 0) {
                alert('Please add at least one requirement');
                setIsLoading(false);
                return;
            }

            const data = {
                title: formData.title.trim(),
                department_id: parseInt(formData.department_id),
                major_id: formData.major_id !== 'none' ? parseInt(formData.major_id) : null,
                location: formData.location.trim(),
                salary: formData.salary.trim() || null,
                company_id: parseInt(formData.company_id),
                requirements: requirementsArray,
                benefits: benefitsArray.length > 0 ? benefitsArray : null,
                question_pack_id: formData.question_pack_id !== 'none' ? parseInt(formData.question_pack_id) : null,
                education_level_id: formData.education_level_id !== 'none' ? parseInt(formData.education_level_id) : null,
                vacancy_type_id: parseInt(formData.vacancy_type_id),
                job_description: formData.job_description.trim() || null,
            };

            await router.put(route('admin.jobs.update', { id: job.id }), data);
            router.visit(route('admin.jobs.index'));
        } catch (error) {
            console.error('Error updating job:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Job - ${job.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Edit Job</h2>
                    <Button
                        variant="outline"
                        onClick={() => router.visit(route('admin.jobs.index'))}
                    >
                        Cancel
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Job Details</CardTitle>
                        <CardDescription>Update the job opening information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Job Title</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="department_id">Department</Label>
                                        <Select
                                            name="department_id"
                                            value={formData.department_id}
                                            onValueChange={(value) => handleChange({ target: { name: 'department_id', value } } as any)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={String(dept.id)}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="vacancy_type_id">Vacancy Type</Label>
                                        <Select
                                            name="vacancy_type_id"
                                            value={formData.vacancy_type_id}
                                            onValueChange={(value) => handleChange({ target: { name: 'vacancy_type_id', value } } as any)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select vacancy type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {vacancyTypes.map((type) => (
                                                    <SelectItem key={type.id} value={String(type.id)}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="job_description">Description</Label>
                                        <Textarea
                                            id="job_description"
                                            name="job_description"
                                            value={formData.job_description}
                                            onChange={handleChange}
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="salary">Salary</Label>
                                        <Input
                                            id="salary"
                                            name="salary"
                                            value={formData.salary}
                                            onChange={handleChange}
                                            placeholder="Enter salary range or amount"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="company_id">Company</Label>
                                        <Select
                                            name="company_id"
                                            value={formData.company_id}
                                            onValueChange={(value) => handleChange({ target: { name: 'company_id', value } } as any)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companies.map((company) => (
                                                    <SelectItem key={company.id} value={String(company.id)}>
                                                        {company.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="major_id">Major</Label>
                                        <Select
                                            name="major_id"
                                            value={formData.major_id}
                                            onValueChange={(value) => handleChange({ target: { name: 'major_id', value } } as any)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select major" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {majors.map((major) => (
                                                    <SelectItem key={major.id} value={String(major.id)}>
                                                        {major.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="education_level_id">Education Level</Label>
                                        <Select
                                            name="education_level_id"
                                            value={formData.education_level_id}
                                            onValueChange={(value) => handleChange({ target: { name: 'education_level_id', value } } as any)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select education level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {educationLevels.map((level) => (
                                                    <SelectItem key={level.id} value={String(level.id)}>
                                                        {level.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="question_pack_id">Question Pack</Label>
                                        <Select
                                            name="question_pack_id"
                                            value={formData.question_pack_id}
                                            onValueChange={(value) => handleChange({ target: { name: 'question_pack_id', value } } as any)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select question pack" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {questionPacks.map((pack) => (
                                                    <SelectItem key={pack.id} value={String(pack.id)}>
                                                        {pack.pack_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="requirements">Requirements (one per line)</Label>
                                        <Textarea
                                            id="requirements"
                                            name="requirements"
                                            value={formData.requirements}
                                            onChange={handleChange}
                                            rows={4}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="benefits">Benefits (one per line, optional)</Label>
                                        <Textarea
                                            id="benefits"
                                            name="benefits"
                                            value={formData.benefits}
                                            onChange={handleChange}
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(route('admin.jobs.index'))}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 