import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Building2, GraduationCap, BookOpen, Users, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface Department {
    id: number;
    name: string;
    vacancies_count: number;
    created_at: string;
    updated_at: string;
}

interface EducationLevel {
    id: number;
    name: string;
    vacancies_count: number;
    created_at: string;
    updated_at: string;
}

interface Major {
    id: number;
    name: string;
    candidates_educations_count: number;
    created_at: string;
    updated_at: string;
}

interface ApplicationStatus {
    id: number;
    name: string;
    code: string;
    description: string;
    type: 'status';
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    departments: Department[];
    educationLevels: EducationLevel[];
    majors: Major[];
    applicationStatuses: ApplicationStatus[];
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Department & Education Management',
        href: '/dashboard/management/department-stage',
    },
];

export default function DepartmentStageManagement({ departments, educationLevels, majors, applicationStatuses }: PageProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
    const [educationLevelDialogOpen, setEducationLevelDialogOpen] = useState(false);
    const [majorDialogOpen, setMajorDialogOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [editingEducationLevel, setEditingEducationLevel] = useState<EducationLevel | null>(null);
    const [editingMajor, setEditingMajor] = useState<Major | null>(null);

    // Form states
    const [departmentForm, setDepartmentForm] = useState({
        name: '',
    });

    const [educationLevelForm, setEducationLevelForm] = useState({
        name: '',
    });

    const [majorForm, setMajorForm] = useState({
        name: '',
    });

    const resetDepartmentForm = () => {
        setDepartmentForm({ name: '' });
        setEditingDepartment(null);
    };

    const resetEducationLevelForm = () => {
        setEducationLevelForm({ name: '' });
        setEditingEducationLevel(null);
    };

    const resetMajorForm = () => {
        setMajorForm({ name: '' });
        setEditingMajor(null);
    };

    // Department handlers
    const handleDepartmentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingDepartment) {
                await axios.put(`/dashboard/management/departments/${editingDepartment.id}`, departmentForm);
                toast.success('Department updated successfully');
            } else {
                await axios.post('/dashboard/management/departments', departmentForm);
                toast.success('Department created successfully');
            }
            
            setDepartmentDialogOpen(false);
            resetDepartmentForm();
            router.reload();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteDepartment = async (id: number) => {
        setIsLoading(true);
        try {
            await axios.delete(`/dashboard/management/departments/${id}`);
            toast.success('Department deleted successfully');
            router.reload();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const openEditDepartment = (department: Department) => {
        setEditingDepartment(department);
        setDepartmentForm({ name: department.name });
        setDepartmentDialogOpen(true);
    };

    // Education Level handlers
    const handleEducationLevelSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingEducationLevel) {
                await axios.put(`/dashboard/management/education-levels/${editingEducationLevel.id}`, educationLevelForm);
                toast.success('Education level updated successfully');
            } else {
                await axios.post('/dashboard/management/education-levels', educationLevelForm);
                toast.success('Education level created successfully');
            }
            
            setEducationLevelDialogOpen(false);
            resetEducationLevelForm();
            router.reload();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteEducationLevel = async (id: number) => {
        setIsLoading(true);
        try {
            await axios.delete(`/dashboard/management/education-levels/${id}`);
            toast.success('Education level deleted successfully');
            router.reload();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const openEditEducationLevel = (educationLevel: EducationLevel) => {
        setEditingEducationLevel(educationLevel);
        setEducationLevelForm({ name: educationLevel.name });
        setEducationLevelDialogOpen(true);
    };

    // Major handlers
    const handleMajorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingMajor) {
                await axios.put(`/dashboard/management/majors/${editingMajor.id}`, majorForm);
                toast.success('Major updated successfully');
            } else {
                await axios.post('/dashboard/management/majors', majorForm);
                toast.success('Major created successfully');
            }
            
            setMajorDialogOpen(false);
            resetMajorForm();
            router.reload();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMajor = async (id: number) => {
        setIsLoading(true);
        try {
            await axios.delete(`/dashboard/management/majors/${id}`);
            toast.success('Major deleted successfully');
            router.reload();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const openEditMajor = (major: Major) => {
        setEditingMajor(major);
        setMajorForm({ name: major.name });
        setMajorDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Department & Education Management" />
            
            <TooltipProvider>
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Department & Education Management</h2>
                    </div>
                    
                    <Tabs defaultValue="departments" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="departments" className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4" />
                                <span>Departments</span>
                            </TabsTrigger>
                            <TabsTrigger value="education-levels" className="flex items-center space-x-2">
                                <GraduationCap className="h-4 w-4" />
                                <span>Education Levels</span>
                            </TabsTrigger>
                            <TabsTrigger value="majors" className="flex items-center space-x-2">
                                <BookOpen className="h-4 w-4" />
                                <span>Majors</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Departments Tab */}
                        <TabsContent value="departments">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Departments</CardTitle>
                                        <CardDescription>Manage organizational departments and track vacancy distribution</CardDescription>
                                    </div>
                                    <Dialog open={departmentDialogOpen} onOpenChange={setDepartmentDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button onClick={resetDepartmentForm}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Department
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    {editingDepartment ? 'Edit Department' : 'Add New Department'}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    {editingDepartment ? 'Update department information' : 'Create a new department for organizing job positions'}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleDepartmentSubmit} className="space-y-4">
                                                <div>
                                                    <Label htmlFor="departmentName">Department Name</Label>
                                                    <Input
                                                        id="departmentName"
                                                        value={departmentForm.name}
                                                        onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                                                        placeholder="e.g., Information Technology"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setDepartmentDialogOpen(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit" disabled={isLoading}>
                                                        {isLoading ? 'Saving...' : editingDepartment ? 'Update' : 'Create'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Vacancies</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {departments.map((department) => (
                                                <TableRow key={department.id}>
                                                    <TableCell className="font-medium">{department.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                                                            <Users className="h-3 w-3" />
                                                            <span>{department.vacancies_count}</span>
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openEditDepartment(department)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            {department.vacancies_count > 0 ? (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            disabled={true}
                                                                            className="cursor-not-allowed"
                                                                        >
                                                                            <Trash2 className="h-4 w-4 text-red-800" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <div className="flex items-center space-x-2">
                                                                            <AlertTriangle className="h-4 w-4 text-red-800" />
                                                                            <span>Cannot delete: {department.vacancies_count} job(s) are using this department</span>
                                                                        </div>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            ) : (
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                        >
                                                                            <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                <AlertDialogContent className="sm:max-w-md">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete Department</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are you sure you want to delete "{department.name}"? This action cannot be undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter className="sm:justify-end">
                                                                        <AlertDialogCancel className="mr-2">
                                                                            Cancel
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleDeleteDepartment(department.id)}
                                                                            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {departments.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                        No departments found. Create your first department to get started.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Education Levels Tab */}
                        <TabsContent value="education-levels">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Education Levels</CardTitle>
                                        <CardDescription>Define and manage education levels for minimum requirements</CardDescription>
                                    </div>
                                    <Dialog open={educationLevelDialogOpen} onOpenChange={setEducationLevelDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button onClick={resetEducationLevelForm}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Education Level
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    {editingEducationLevel ? 'Edit Education Level' : 'Add New Education Level'}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    {editingEducationLevel ? 'Update education level information' : 'Create a new education level for minimum requirements'}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleEducationLevelSubmit} className="space-y-4">
                                                <div>
                                                    <Label htmlFor="educationLevelName">Education Level Name</Label>
                                                    <Input
                                                        id="educationLevelName"
                                                        value={educationLevelForm.name}
                                                        onChange={(e) => setEducationLevelForm({ ...educationLevelForm, name: e.target.value })}
                                                        placeholder="e.g., SMA/SMK, D3, S1, S2, S3"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setEducationLevelDialogOpen(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit" disabled={isLoading}>
                                                        {isLoading ? 'Saving...' : editingEducationLevel ? 'Update' : 'Create'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Vacancies</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {educationLevels.map((level) => (
                                                <TableRow key={level.id}>
                                                    <TableCell>
                                                        <span className="font-mono text-sm">{level.id}</span>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{level.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                                                            <Users className="h-3 w-3" />
                                                            <span>{level.vacancies_count}</span>
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openEditEducationLevel(level)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            {level.vacancies_count > 0 ? (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            disabled={true}
                                                                            className="cursor-not-allowed"
                                                                        >
                                                                            <Trash2 className="h-4 w-4 text-red-800" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <div className="flex items-center space-x-2">
                                                                            <AlertTriangle className="h-4 w-4 text-red-800" />
                                                                            <span>Cannot delete: {level.vacancies_count} job(s) require this education level</span>
                                                                        </div>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            ) : (
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                        >
                                                                            <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                <AlertDialogContent className="sm:max-w-md">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete Education Level</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are you sure you want to delete "{level.name}"? This action cannot be undone and may affect existing vacancies.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter className="sm:justify-end">
                                                                        <AlertDialogCancel className="mr-2">
                                                                            Cancel
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleDeleteEducationLevel(level.id)}
                                                                            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {educationLevels.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                        No education levels found. Create your first education level to get started.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Majors Tab */}
                        <TabsContent value="majors">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Majors</CardTitle>
                                        <CardDescription>Manage academic majors and fields of study</CardDescription>
                                    </div>
                                    <Dialog open={majorDialogOpen} onOpenChange={setMajorDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button onClick={resetMajorForm}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Major
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    {editingMajor ? 'Edit Major' : 'Add New Major'}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    {editingMajor ? 'Update major information' : 'Create a new academic major or field of study'}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleMajorSubmit} className="space-y-4">
                                                <div>
                                                    <Label htmlFor="majorName">Major Name</Label>
                                                    <Input
                                                        id="majorName"
                                                        value={majorForm.name}
                                                        onChange={(e) => setMajorForm({ ...majorForm, name: e.target.value })}
                                                        placeholder="e.g., Computer Science, Mechanical Engineering"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setMajorDialogOpen(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit" disabled={isLoading}>
                                                        {isLoading ? 'Saving...' : editingMajor ? 'Update' : 'Create'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Used by Candidates</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {majors.map((major) => (
                                                <TableRow key={major.id}>
                                                    <TableCell>
                                                        <span className="font-mono text-sm">{major.id}</span>
                                                    </TableCell>
                                                    <TableCell className="font-medium">{major.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                                                            <Users className="h-3 w-3" />
                                                            <span>{major.candidates_educations_count}</span>
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openEditMajor(major)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            {major.candidates_educations_count > 0 ? (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            disabled={true}
                                                                            className="cursor-not-allowed"
                                                                        >
                                                                            <Trash2 className="h-4 w-4 text-red-800" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <div className="flex items-center space-x-2">
                                                                            <AlertTriangle className="h-4 w-4 text-red-800" />
                                                                            <span>Cannot delete: {major.candidates_educations_count} candidate(s) have this major</span>
                                                                        </div>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            ) : (
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                        >
                                                                            <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                <AlertDialogContent className="sm:max-w-md">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete Major</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are you sure you want to delete "{major.name}"? This action cannot be undone and may affect candidate profiles.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter className="sm:justify-end">
                                                                        <AlertDialogCancel className="mr-2">
                                                                            Cancel
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleDeleteMajor(major.id)}
                                                                            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {majors.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                        No majors found. Create your first major to get started.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            </TooltipProvider>
        </AppLayout>
    );
} 