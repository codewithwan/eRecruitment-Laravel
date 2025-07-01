import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import SortButton from './sort-button';
import { ChevronLeft, ChevronRight, Eye, Check, X } from 'lucide-react';

export interface ReportCandidate {
    id: string;
    name: string;
    email: string;
    position: string;
    registration_date: string;
    period?: string;
    overall_score?: number;
    final_decision?: string;
    final_notes?: string;
    rejection_reason?: string;
    recommendation?: string;
    decision_made_by?: string;
    decision_made_at?: string;
    report_generated_by?: string;
    report_generated_at?: string;
    administration_score?: number;
    assessment_score?: number;
    interview_score?: number;
    stage_summary?: any;
    strengths?: string;
    weaknesses?: string;
    next_steps?: string;
}

interface PaginationData {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface ReportsTableProps {
    candidates: ReportCandidate[];
    pagination: PaginationData;
    onView?: (id: string) => void;
    onApprove?: (id: string) => void;
    onDelete?: (id: string) => void;
    onPageChange?: (page: number) => void;
    isLoading?: boolean;
}

export function ReportsTable({
    candidates,
    pagination,
    onView = () => {},
    onApprove = () => {},
    onDelete = () => {},
    onPageChange = () => {},
    isLoading = false,
}: ReportsTableProps) {
    const handleNextPage = () => {
        if (pagination.current_page < pagination.last_page) {
            onPageChange(pagination.current_page + 1);
        }
    };

    const handlePrevPage = () => {
        if (pagination.current_page > 1) {
            onPageChange(pagination.current_page - 1);
        }
    };

    const calculateAvg = (candidate: ReportCandidate) => {
        const { administration_score, assessment_score, interview_score } = candidate;
        const admin = administration_score || 0;
        const assess = assessment_score || 0;
        const inter = interview_score || 0;
        return((admin + assess + inter) / 3).toFixed(1);
    }

    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    
    const sortedCandidates = [...candidates].sort((a, b) => {
        const avgA = Number(calculateAvg(a));
        const avgB = Number(calculateAvg(b));
        return sortOrder === 'asc' ? avgA - avgB : avgB - avgA;
    })

    return (
        <div className="w-full">
            <div className="overflow-x-auto rounded-md border border-gray-200">
                <Table className="min-w-full bg-blue-50 [&_tr:hover]:bg-transparent">
                    <TableHeader className="bg-blue-50">
                        <TableRow>
                            <TableHead className="w-[60px] py-3">ID</TableHead>
                            <TableHead className="w-[180px] py-3">Name</TableHead>
                            <TableHead className="w-[200px] py-3">Email</TableHead>
                            <TableHead className="w-[120px] py-3">Position</TableHead>
                            <TableHead className="w-[110px] py-3">Administration</TableHead>
                            <TableHead className="w-[110px] py-3">Assessment</TableHead>
                            <TableHead className="w-[110px] py-3">Interview</TableHead>
                            <TableHead className="w-[100px] py-3 pt-1">Average Score 
                                <SortButton 
                                    sortOrder={sortOrder} 
                                    onToggle={() => setSortOrder((sortOrder === 'asc' ? 'desc' : 'asc'))} 
                                /> 
                            </TableHead>
                            <TableHead className="w-[130px] py-3 text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading
                            ? Array(pagination.per_page)
                                  .fill(0)
                                  .map((_, idx) => (
                                      <TableRow key={`skeleton-${idx}`}>
                                          <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                          <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                          <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                          <TableCell>
                                              <div className="flex justify-center space-x-2">
                                                  <Skeleton className="h-8 w-8 rounded-full" />
                                                  <Skeleton className="h-8 w-8 rounded-full" />
                                                  <Skeleton className="h-8 w-8 rounded-full" />
                                              </div>
                                          </TableCell>
                                      </TableRow>
                                  ))
                            : sortedCandidates.length > 0
                            ? sortedCandidates.map((candidate, idx) => (
                                  <TableRow key={candidate.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                                      <TableCell>{candidate.id}</TableCell>
                                      <TableCell>{candidate.name}</TableCell>
                                      <TableCell>{candidate.email}</TableCell>
                                      <TableCell>{candidate.position}</TableCell>
                                      <TableCell>{candidate.administration_score || 0}</TableCell>
                                      <TableCell>{candidate.assessment_score || 0}</TableCell>
                                      <TableCell>{candidate.interview_score || 0}</TableCell>
                                      <TableCell>{calculateAvg(candidate)}</TableCell>
                                      <TableCell>
                                          <div className="flex justify-center space-x-2">
                                              <Button
                                                  onClick={() => onView(candidate.id)}
                                                  size="sm"
                                                  variant="ghost"
                                                  className="h-8 w-8 p-0 text-blue-500"
                                              >
                                                  <Eye size={16} />
                                              </Button>
                                              <Button
                                                  onClick={() => onApprove(candidate.id)}
                                                  size="sm"
                                                  variant="ghost"
                                                  className="h-8 w-8 p-0 text-green-500"
                                                  title="Approve"
                                              >
                                                  <Check size={16} />
                                              </Button>
                                              <Button
                                                  onClick={() => onDelete(candidate.id)}
                                                  size="sm"
                                                  variant="ghost"
                                                  className="h-8 w-8 p-0 text-blue-500"
                                              >
                                                  <X size={16} />
                                              </Button>
                                          </div>
                                      </TableCell>
                                  </TableRow>
                              ))
                            : (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-4 text-center">
                                        No candidates found.
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <button
                        onClick={handlePrevPage}
                        disabled={pagination.current_page === 1 || isLoading}
                        className="flex items-center justify-center rounded-md border border-blue-500 px-2 py-1 text-blue-500 hover:bg-blue-100 disabled:opacity-50"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: Math.min(5, pagination.last_page) }).map((_, idx) => {
                        const pageNumber = idx + 1;
                        const isActive = pageNumber === pagination.current_page;
                        const isVisible =
                            pageNumber === 1 ||
                            pageNumber === pagination.last_page ||
                            isActive ||
                            Math.abs(pageNumber - pagination.current_page) <= 1;
                        return (
                            <button
                                key={idx}
                                onClick={() => onPageChange(pageNumber)}
                                disabled={isLoading}
                                className={`flex h-8 min-w-[32px] items-center justify-center rounded-md px-2 ${
                                    isActive ? 'bg-blue-500 text-white' : 'border border-blue-500 bg-white text-blue-500 hover:bg-blue-100'
                                } ${!isVisible ? 'hidden sm:flex' : ''}`}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                    <button
                        onClick={handleNextPage}
                        disabled={pagination.current_page === pagination.last_page || isLoading}
                        className="flex items-center justify-center rounded-md border border-blue-500 px-2 py-1 text-blue-500 hover:bg-blue-100 disabled:opacity-50"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
                <div className="text-sm text-gray-500">
                    Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{' '}
                    {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} entries
                </div>
            </div>
        </div>
    );
}