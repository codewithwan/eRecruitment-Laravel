import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { router } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

interface CreateJobPageProps {
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
        title: 'Create Job',
        href: '#',
    },
];

export default function CreateJob({ companies, departments, majors, questionPacks, educationLevels, vacancyTypes }: CreateJobPageProps) {
    const [requirements, setRequirements] = useState<string>("");
    const [benefits, setBenefits] = useState<string>("");

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        department_id: "",
        major_id: "",
        location: "",
        salary: "",
        company_id: "",
        vacancy_type_id: "",
        job_description: "",
        question_pack_id: "",
        education_level_id: "",
        requirements: [] as string[],
        benefits: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Convert requirements and benefits from string to array
        const requirementsArray = requirements.split('\n').filter(req => req.trim() !== '');
        const benefitsArray = benefits.split('\n').filter(ben => ben.trim() !== '');
        
        if (requirementsArray.length === 0) {
            alert('Please add at least one requirement');
            return;
        }
        
        // Create the submission data
        const submitData = {
            ...data,
            requirements: requirementsArray,
            benefits: benefitsArray,
        };
        
        // Submit using router.post
        router.post(route('admin.jobs.store'), submitData, {
            onSuccess: () => {
                router.visit(route('admin.jobs.index'));
            },
            onError: (errors) => {
                console.error('Job creation failed:', errors);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Job Vacancy" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Create Job Vacancy</h2>
                    <Button
                        variant="outline"
                        onClick={() => router.visit(route('admin.jobs.index'))}
                    >
                        Cancel
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create New Job Vacancy</CardTitle>
                        <CardDescription>Fill in the details to create a new job opening.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Job Title</Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            placeholder="Enter job title"
                                        />
                                        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="department">Department</Label>
                                        <Select value={data.department_id} onValueChange={(value) => setData('department_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((department) => (
                                                    <SelectItem key={department.id} value={department.id.toString()}>
                                                        {department.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.department_id && <p className="text-red-500 text-sm">{errors.department_id}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="vacancy_type">Vacancy Type</Label>
                                        <Select value={data.vacancy_type_id} onValueChange={(value) => setData('vacancy_type_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select vacancy type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {vacancyTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.id.toString()}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.vacancy_type_id && <p className="text-red-500 text-sm">{errors.vacancy_type_id}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="major">Major</Label>
                                        <Select value={data.major_id} onValueChange={(value) => setData('major_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select major" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {majors.map((major) => (
                                                    <SelectItem key={major.id} value={major.id.toString()}>
                                                        {major.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.major_id && <p className="text-red-500 text-sm">{errors.major_id}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={data.location}
                                            onChange={e => setData('location', e.target.value)}
                                            placeholder="Enter job location"
                                        />
                                        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="salary">Salary Range</Label>
                                        <Input
                                            id="salary"
                                            value={data.salary}
                                            onChange={e => setData('salary', e.target.value)}
                                            placeholder="Enter salary range"
                                        />
                                        {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="company">Company</Label>
                                        <Select value={data.company_id} onValueChange={(value) => setData('company_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {companies.map((company) => (
                                                    <SelectItem key={company.id} value={company.id.toString()}>
                                                        {company.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.company_id && <p className="text-red-500 text-sm">{errors.company_id}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="question_pack">Question Pack</Label>
                                        <Select value={data.question_pack_id} onValueChange={(value) => setData('question_pack_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select question pack" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {questionPacks.map((pack) => (
                                                    <SelectItem key={pack.id} value={pack.id.toString()}>
                                                        {pack.pack_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.question_pack_id && <p className="text-red-500 text-sm">{errors.question_pack_id}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="education_level">Education Level</Label>
                                        <Select value={data.education_level_id} onValueChange={(value) => setData('education_level_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select education level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {educationLevels.map((level) => (
                                                    <SelectItem key={level.id} value={level.id.toString()}>
                                                        {level.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.education_level_id && <p className="text-red-500 text-sm">{errors.education_level_id}</p>}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.job_description}
                                    onChange={e => setData('job_description', e.target.value)}
                                    placeholder="Enter job description"
                                    className="min-h-[100px]"
                                />
                                {errors.job_description && <p className="text-red-500 text-sm">{errors.job_description}</p>}
                            </div>

                            <div>
                                <Label htmlFor="requirements">Requirements (one per line)</Label>
                                <Textarea
                                    id="requirements"
                                    value={requirements}
                                    onChange={e => setRequirements(e.target.value)}
                                    placeholder="Enter job requirements (one per line)"
                                    className="min-h-[100px]"
                                />
                                {errors.requirements && <p className="text-red-500 text-sm">{errors.requirements}</p>}
                            </div>

                            <div>
                                <Label htmlFor="benefits">Benefits (one per line, optional)</Label>
                                <Textarea
                                    id="benefits"
                                    value={benefits}
                                    onChange={e => setBenefits(e.target.value)}
                                    placeholder="Enter job benefits (one per line)"
                                    className="min-h-[100px]"
                                />
                                {errors.benefits && <p className="text-red-500 text-sm">{errors.benefits}</p>}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(route('admin.jobs.index'))}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Create Job
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 