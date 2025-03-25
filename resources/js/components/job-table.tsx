import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { JobTableProps } from '@/types/job';
import { EyeIcon, Pencil, Trash2 } from 'lucide-react';

export function JobTable({ jobs, onView, onEdit, onDelete }: JobTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {jobs.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">
                            No jobs found
                        </TableCell>
                    </TableRow>
                ) : (
                    jobs.map((job) => (
                        <TableRow key={job.id}>
                            <TableCell>{job.id}</TableCell>
                            <TableCell>{job.title}</TableCell>
                            <TableCell>{job.department}</TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell className="space-x-2 text-right">
                                <Button variant="ghost" size="icon" onClick={() => onView(job.id)}>
                                    <EyeIcon className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => onEdit(job.id)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => onDelete(job.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
