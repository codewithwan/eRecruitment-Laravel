<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PsychometricAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_id',
        'assessment_id',
        'scheduled_date',
        'status',
        'notification_sent',
    ];

    protected $casts = [
        'scheduled_date' => 'datetime',
        'notification_sent' => 'boolean',
    ];

    /**
     * Get the candidate associated with the assignment.
     */
    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    /**
     * Get the assessment associated with the assignment.
     */
    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }

    /**
     * Get the duration for this assignment from the associated assessment.
     */
    public function getDuration(): string
    {
        return $this->assessment->duration;
    }

    /**
     * Check if the assignment is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the assignment is ongoing.
     */
    public function isOngoing(): bool
    {
        return $this->status === 'ongoing';
    }

    /**
     * Check if the assignment is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }
}
