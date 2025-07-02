<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Application extends Model
{
    use HasFactory;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'applications';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'vacancy_period_id',
        'status_id',
        'current_stage_id',
        'current_stage',
        'applied_at',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'current_stage' => ApplicationStatus::class,
        'applied_at' => 'datetime',
    ];
    
    /**
     * Get the user that owns the application.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get the vacancy-period combination that the user applied to.
     */
    public function vacancyPeriod(): BelongsTo
    {
        return $this->belongsTo(VacancyPeriods::class, 'vacancy_period_id');
    }
    
    /**
     * Get the vacancy that the user applied to (through the vacancy_period relation)
     */
    public function vacancy()
    {
        return $this->vacancyPeriod ? $this->vacancyPeriod->vacancy : null;
    }
    
    /**
     * Get the status of the application.
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }
    
    /**
     * Get the current stage of the application.
     */
    public function currentStage(): BelongsTo
    {
        return $this->belongsTo(Status::class, 'current_stage_id');
    }
    
    /**
     * Get the recruitment period for this application (through the vacancy_period relation)
     */
    public function period()
    {
        return $this->vacancyPeriod ? $this->vacancyPeriod->period : null;
    }
    
    /**
     * Get the application administration data.
     */
    public function administration(): HasOne
    {
        return $this->hasOne(ApplicationAdministration::class);
    }
    
    /**
     * Get the application assessment data.
     */
    public function assessment(): HasOne
    {
        return $this->hasOne(ApplicationAssessment::class);
    }
    
    /**
     * Get the application interview data.
     */
    public function interview(): HasOne
    {
        return $this->hasOne(ApplicationInterview::class);
    }
    
    /**
     * Get the application report data.
     */
    public function report(): HasOne
    {
        return $this->hasOne(ApplicationReport::class);
    }
    

    
    /**
     * Get the admin who reviewed the application.
     */
    public function adminReviewer(): ?User
    {
        return $this->administration?->reviewer;
    }
    
    /**
     * Get the interviewer.
     */
    public function interviewer(): ?User
    {
        return $this->interview?->interviewer;
    }
    
    /**
     * Get the user who made the final decision.
     */
    public function decisionMaker(): ?User
    {
        return $this->report?->decisionMaker;
    }
    
    /**
     * Get user answers for tests (relationship to UserAnswer)
     */
    public function userAnswers(): HasMany
    {
        return $this->hasMany(UserAnswer::class, 'user_id', 'user_id');
    }
    
    /**
     * Update application stage and status
     */
    public function updateStage(ApplicationStatus $stage, ?int $statusId = null): void
    {
        // Update the enum stage
        $this->update(['current_stage' => $stage]);
        
        // Update current_stage_id and status_id based on matching stage/status in statuses table
        $statusRecord = Status::where('code', $stage->value)->first();
        if ($statusRecord) {
            if ($statusRecord->isStage()) {
                $this->update(['current_stage_id' => $statusRecord->id]);
        }
            if ($statusRecord->isStatus()) {
                $this->update(['status_id' => $statusRecord->id]);
            }
        }
        
        // If a specific status is provided, update it
        if ($statusId) {
            $this->update(['status_id' => $statusId]);
        }
    }
    
    /**
     * Get the current stage label
     */
    public function getCurrentStageLabel(): string
    {
        return $this->current_stage->label();
    }
    
    /**
     * Check if application is in a specific stage
     */
    public function isInStage(ApplicationStatus $stage): bool
    {
        return $this->current_stage === $stage;
    }
    
    /**
     * Get overall score based on current stage
     */
    public function getOverallScore(): ?float
    {
        if (!$this->report) {
            return null;
        }
        
        return $this->report->overall_score ?? $this->report->calculateOverallScore();
    }
    
    /**
     * Get the next scheduled event for this application.
     */
    public function getNextSchedule(): ?array
    {
        $upcomingEvents = [];
        
        // Check assessment schedule
        if ($this->assessment && $this->assessment->scheduled_at && $this->assessment->scheduled_at->isFuture()) {
            $upcomingEvents[] = [
                'type' => 'assessment',
                'scheduled_at' => $this->assessment->scheduled_at,
                'location' => $this->assessment->test_location,
            ];
        }
        
        // Check interview schedule
        if ($this->interview && $this->interview->scheduled_at && $this->interview->scheduled_at->isFuture()) {
            $upcomingEvents[] = [
                'type' => 'interview',
                'scheduled_at' => $this->interview->scheduled_at,
                'location' => $this->interview->location,
                'is_online' => $this->interview->is_online,
            ];
        }
        
        if (empty($upcomingEvents)) {
            return null;
        }
        
        // Return the earliest upcoming event
        usort($upcomingEvents, function($a, $b) {
            return $a['scheduled_at']->timestamp <=> $b['scheduled_at']->timestamp;
        });
        
        return $upcomingEvents[0];
    }
    
    /**
     * Check if the application is accepted
     */
    public function isAccepted(): bool
    {
        return $this->status && $this->status->code === 'accepted';
    }
    
    /**
     * Check if the application is rejected
     */
    public function isRejected(): bool
    {
        return $this->status && $this->status->code === 'rejected';
    }
    
    /**
     * Check if the application is still pending
     */
    public function isPending(): bool
    {
        return $this->status && $this->status->code === 'pending';
    }
} 