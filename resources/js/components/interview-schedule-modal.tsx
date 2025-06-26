import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface InterviewScheduleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    interviewDate: string;
    setInterviewDate: (date: string) => void;
    interviewLink: string;
    setInterviewLink: (link: string) => void;
    interviewNote: string;
    setInterviewNote: (note: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading?: boolean;
}

export function InterviewScheduleModal({
    open,
    onOpenChange,
    interviewDate,
    setInterviewDate,
    interviewLink,
    setInterviewLink,
    interviewNote,
    setInterviewNote,
    onSubmit,
    isLoading = false,
}: InterviewScheduleModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Interview Schedule</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Interview Date</label>
                        <Input
                            type="datetime-local"
                            value={interviewDate}
                            onChange={e => setInterviewDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Interview Link</label>
                        <Input
                            type="url"
                            placeholder="https://meet.example.com/..."
                            value={interviewLink}
                            onChange={e => setInterviewLink(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Note</label>
                        <Textarea
                            placeholder="Add interview notes (optional)..."
                            value={interviewNote}
                            onChange={e => setInterviewNote(e.target.value)}
                            className="min-h-[80px] border-gray-200 focus:border-gray-300 focus:ring-0"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save & Approve'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}