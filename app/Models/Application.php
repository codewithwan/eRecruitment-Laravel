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
        'resume_path',
        'cover_letter_path',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        //
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
     * Get the recruitment period for this application (through the vacancy_period relation)
     */
    public function period()
    {
        return $this->vacancyPeriod ? $this->vacancyPeriod->period : null;
    }
    
    /**
     * Get all application history records.
     */
    public function history(): HasMany
    {
        return $this->hasMany(ApplicationHistory::class);
    }
    
    /**
     * Get administration history (admin_selection status).
     */
    public function administration(): HasOne
    {
        return $this->hasOne(ApplicationHistory::class)->whereHas('status', function($query) {
            $query->where('code', 'administration');
        });
    }
    
    /**
     * Get assessment history (psychotest status).
     */
    public function assessment(): HasOne
    {
        return $this->hasOne(ApplicationHistory::class)->whereHas('status', function($query) {
            $query->where('code', 'assessment');
        });
    }
    
    /**
     * Get interview history (interview status).
     */
    public function interview(): HasOne
    {
        return $this->hasOne(ApplicationHistory::class)->whereHas('status', function($query) {
            $query->where('code', 'interview');
        });
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
        return $this->administration()?->reviewer;
    }
    
    /**
     * Get the interviewer.
     */
    public function interviewer(): ?User
    {
        return $this->interview()?->reviewer;
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
        $assessment = $this->assessment();
        if ($assessment && $assessment->scheduled_at && $assessment->scheduled_at->isFuture()) {
            $upcomingEvents[] = [
                'type' => 'assessment',
                'scheduled_at' => $assessment->scheduled_at,
                'notes' => $assessment->notes,
            ];
        }
        
        // Check interview schedule
        $interview = $this->interview();
        if ($interview && $interview->scheduled_at && $interview->scheduled_at->isFuture()) {
            $upcomingEvents[] = [
                'type' => 'interview',
                'scheduled_at' => $interview->scheduled_at,
                'notes' => $interview->notes,
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