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

    // Reset form when dialog opens
    useEffect(() => {
        if (isOpen) {
            setScore('70');
            setNotes('');
            setError('');
            setIsSubmitting(false);
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

        setIsSubmitting(true);

        router.post(`/applications/${applicationId}/${stage}`, {
            status: action === 'accept' ? 'passed' : 'rejected',
            score: action === 'accept' ? parseInt(score) : null,
            notes: notes || null,
        }, {
            onSuccess: () => {
                setIsSubmitting(false);
                onClose();
                // Redirect back to the previous page
                window.history.back();
            },
            onError: () => {
                setIsSubmitting(false);
                setError('Failed to process the application. Please try again.');
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
                    {((stage === 'administration' || stage === 'interview') && action === 'accept') && (
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