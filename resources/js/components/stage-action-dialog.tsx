import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { Input } from './ui/input';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    applicationId: number;
    stage: string;
    action: 'accept' | 'reject';
    title: string;
    description: string;
    noScore?: boolean;
}

export default function StageActionDialog({ isOpen, onClose, applicationId, stage, action, title, description, noScore = false }: Props) {
    const [score, setScore] = useState<string>('70');
    const [notes, setNotes] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [zoomUrl, setZoomUrl] = useState<string>('');
    const [scheduledAt, setScheduledAt] = useState<string>('');

    // Reset form when dialog opens
    useEffect(() => {
        if (isOpen) {
            setScore('70');
            setNotes('');
            setError('');
            setIsSubmitting(false);
            setZoomUrl('');
            setScheduledAt('');
        }
    }, [isOpen]);

    const handleScoreChange = (value: string) => {
        // Remove non-numeric characters
        const numericValue = value.replace(/[^0-9]/g, '');
        
        if (numericValue === '') {
            setScore('');
            setError('Score is required');
            return;
        }

        const numberValue = parseInt(numericValue, 10);
        
        if (numberValue < 10) {
            setScore(numericValue);
            setError('Score must be at least 10');
        } else if (numberValue > 99) {
            setScore('99');
            setError('Score cannot exceed 99');
        } else {
            setScore(numberValue.toString());
            setError('');
        }
    };

    const incrementScore = () => {
        const currentScore = parseInt(score || '0', 10);
        if (currentScore < 99) {
            handleScoreChange((currentScore + 1).toString());
        }
    };

    const decrementScore = () => {
        const currentScore = parseInt(score || '0', 10);
        if (currentScore > 10) {
            handleScoreChange((currentScore - 1).toString());
        }
    };

    const handleSubmit = () => {
        if (isSubmitting) return;

        // Score is required for administration and interview stages (but not for final stage)
        if (action === 'accept' && (stage === 'administration' || stage === 'interview')) {
            if (!score || parseInt(score) < 10 || parseInt(score) > 99) {
                setError('Please enter a valid score between 10 and 99');
                return;
            }
        }

        if (action === 'reject' && !notes) {
            setError('Notes are required when rejecting a candidate');
            return;
        }

        // Validate Zoom URL and schedule for assessment stage passing to interview
        if (stage === 'psychological_test' && action === 'accept') {
            if (!zoomUrl) {
                setError('Zoom URL is required for interview scheduling');
                return;
            }
            if (!scheduledAt) {
                setError('Interview schedule is required');
                return;
            }
        }

        setIsSubmitting(true);

        router.post(`/dashboard/recruitment/applications/${applicationId}/${stage}`, {
            status: action === 'accept' ? 'passed' : 'rejected',
            score: (action === 'accept' && (stage === 'administration' || stage === 'interview')) ? parseInt(score) : null,
            notes: notes || null,
            zoom_url: stage === 'psychological_test' && action === 'accept' ? zoomUrl : null,
            scheduled_at: stage === 'psychological_test' && action === 'accept' ? scheduledAt : null,
        }, {
            preserveState: false,
            preserveScroll: false,
            onSuccess: () => {
                setIsSubmitting(false);
                onClose();
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setError('Failed to process the application. Please try again.');
                console.error('Stage action error:', errors);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Interview Schedule Fields */}
                    {stage === 'psychological_test' && action === 'accept' && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="zoom_url">Zoom Meeting URL (Required)</Label>
                                <Input
                                    id="zoom_url"
                                    type="url"
                                    value={zoomUrl}
                                    onChange={(e) => setZoomUrl(e.target.value)}
                                    placeholder="https://zoom.us/j/..."
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="scheduled_at">Interview Schedule (Required)</Label>
                                <Input
                                    id="scheduled_at"
                                    type="datetime-local"
                                    value={scheduledAt}
                                    onChange={(e) => setScheduledAt(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </>
                    )}

                    {/* Score Input */}
                    {(stage !== 'final' && (stage === 'administration' || stage === 'interview') && action === 'accept') && (
                        <div className="grid gap-2">
                            <Label htmlFor="score">Score (10-99)</Label>
                            <div className="flex justify-center items-center gap-2">
                                <div className="relative w-[120px] bg-white rounded-lg shadow-sm">
                                    <input
                                        type="text"
                                        value={score}
                                        onChange={(e) => handleScoreChange(e.target.value)}
                                        className="w-full h-16 text-4xl font-bold text-center bg-transparent border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                        maxLength={2}
                                        disabled={isSubmitting}
                                    />
                                    <div className="absolute right-1 inset-y-0 flex flex-col justify-center gap-0.5">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 hover:bg-gray-100"
                                            onClick={incrementScore}
                                            disabled={isSubmitting}
                                        >
                                            <ChevronUp className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 hover:bg-gray-100"
                                            onClick={decrementScore}
                                            disabled={isSubmitting}
                                        >
                                            <ChevronDown className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {error && <p className="text-sm text-destructive text-center">{error}</p>}
                        </div>
                    )}

                    {/* Notes Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="notes">
                            {action === 'reject' ? 'Rejection Reason (Required)' : 'Notes (Optional)'}
                        </Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={action === 'reject' ? 'Please provide a reason for rejection' : 'Add any additional notes'}
                            className="resize-none"
                            rows={4}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        variant={action === 'accept' ? 'default' : 'destructive'}
                        disabled={isSubmitting}
                    >
                        {isSubmitting 
                            ? 'Processing...' 
                            : action === 'accept' 
                                ? 'Accept' 
                                : 'Reject'
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 