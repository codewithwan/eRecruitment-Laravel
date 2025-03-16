import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, ExternalLink, Mail, Phone, GraduationCap, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const userData = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        university: "University A",
        major: "Computer Science",
        gradYear: 2023,
        position: "Frontend Developer",
        status: "Shortlisted",
        portfolio: "https://portfolio.johndoe.com",
        skills: ["React", "TypeScript", "UI/UX"],
        avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "987-654-3210",
        university: "University B",
        major: "Information Technology",
        gradYear: 2022,
        position: "Backend Developer",
        status: "Interview",
        portfolio: "https://portfolio.janesmith.com",
        skills: ["Node.js", "Python", "MongoDB"],
        avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        phone: "555-123-4567",
        university: "University C",
        major: "Software Engineering",
        gradYear: 2024,
        position: "Full Stack Developer",
        status: "New",
        portfolio: "https://portfolio.alicejohnson.com",
        skills: ["React", "Express", "PostgreSQL"],
        avatar: "https://i.pravatar.cc/150?img=3",
    },
];

// Status badge colors
type StatusColor = "default" | "secondary" | "destructive" | "outline";

const getStatusColor = (status: string): StatusColor => {
    switch (status) {
        case "Shortlisted": return "default";
        case "Interview": return "secondary";
        case "New": return "destructive";
        default: return "outline";
    }
};

export default function CandidateList() {
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const toggleRowExpansion = (rowId: number) => {
        setExpandedRows(prev =>
            prev.includes(rowId)
                ? prev.filter(id => id !== rowId)
                : [...prev, rowId]
        );
    };

    return (
        <Table className="rounded-lg border overflow-hidden">
            <TableHeader className="bg-slate-50">
                <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {userData.map((user) => (
                    <>
                        <TableRow
                            key={user.id}
                            className="cursor-pointer transition-colors hover:bg-muted/30"
                            onClick={() => toggleRowExpansion(user.id)}
                        >
                            <TableCell className="w-10">
                                <div className="flex justify-center">
                                    {expandedRows.includes(user.id) ? (
                                        <ChevronUp className="size-4 text-slate-500" />
                                    ) : (
                                        <ChevronDown className="size-4 text-slate-500" />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9 border">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm">{user.position}</TableCell>
                            <TableCell className="text-sm">{user.university}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusColor(user.status)} className="font-normal">
                                    {user.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                        {expandedRows.includes(user.id) && (
                            <TableRow>
                                <TableCell colSpan={5} className="bg-slate-50/50 p-0">
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                                            <div>
                                                <h4 className="text-lg font-medium mb-4">{user.name}</h4>

                                                <div className="space-y-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="size-4 text-muted-foreground" />
                                                        <span>{user.email}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Phone className="size-4 text-muted-foreground" />
                                                        <span>{user.phone}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="size-4 text-muted-foreground" />
                                                        <span>{user.university} • {user.major} ({user.gradYear})</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Briefcase className="size-4 text-muted-foreground" />
                                                        <span>Applied for: {user.position}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="font-medium mb-3 text-sm">Skills</h5>
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {user.skills.map((skill, index) => (
                                                        <Badge key={index} variant="outline" className="font-normal">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <Separator className="my-4" />

                                                <div className="mt-4">
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        <ExternalLink className="size-3" />
                                                        <a
                                                            href={user.portfolio}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            View Portfolio
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </>
                ))}
            </TableBody>
        </Table>
    );
}
