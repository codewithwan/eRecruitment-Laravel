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
     * Get the application evaluation data.
     */
    public function evaluation(): HasOne
    {
        return $this->hasOne(ApplicationEvaluation::class);
    }
    
    /**
     * Get the application schedule data.
     */
    public function schedule(): HasOne
    {
        return $this->hasOne(ApplicationSchedule::class);
    }
    
    /**
     * Get the admin who reviewed the application.
     */
    public function adminReviewer(): BelongsTo
    {
        return $this->evaluation ? $this->evaluation->adminReviewer() : null;
    }
    
    /**
     * Get the interviewer.
     */
    public function interviewer(): BelongsTo
    {
        return $this->evaluation ? $this->evaluation->interviewer() : null;
    }
    
    /**
     * Get the user who made the final decision.
     */
    public function decisionMaker(): BelongsTo
    {
        return $this->evaluation ? $this->evaluation->decisionMaker() : null;
    }
    
    /**
     * Get all stage history records for this application.
     */
    public function stageHistories(): HasMany
    {
        return $this->hasMany(ApplicationStageHistory::class)->orderBy('changed_at');
    }
    
    /**
     * Get user answers for tests (relationship to UserAnswer)
     */
    public function userAnswers(): HasMany
    {
        return $this->hasMany(UserAnswer::class, 'user_id', 'user_id');
    }
    
    /**
     * Add a stage progression entry
     */
    public function addStageProgression(ApplicationStatus $fromStage, ApplicationStatus $toStage, ?string $notes = null, ?int $userId = null): void
    {
        ApplicationStageHistory::create([
            'application_id' => $this->id,
            'from_stage' => $fromStage,
            'to_stage' => $toStage,
            'notes' => $notes,
            'changed_by' => $userId,
            'changed_at' => now(),
        ]);
        
        // Update the enum stage
        $this->update(['current_stage' => $toStage]);
        
        // Update current_stage_id based on matching stage/status in statuses table
        $statusRecord = Status::where('code', $toStage->value)->first();
        if ($statusRecord) {
            if ($statusRecord->isStage()) {
                $this->update(['current_stage_id' => $statusRecord->id]);
            }
            if ($statusRecord->isStatus()) {
                $this->update(['status_id' => $statusRecord->id]);
            }
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
     * Check if application has completed a specific stage
     */
    public function hasCompletedStage(ApplicationStatus $stage): bool
    {
        return $this->stageHistories()
            ->where('from_stage', $stage)
            ->exists();
    }
    
    /**
     * Get the latest stage progression
     */
    public function getLatestStageHistory()
    {
        return $this->stageHistories()->latest('changed_at')->first();
    }
    
    /**
     * Get overall score based on current stage
     */
    public function getOverallScore(): ?float
    {
        if (!$this->evaluation) {
            return null;
        }
        
        return $this->evaluation->getOverallScore();
    }
    
    /**
     * Get the next scheduled event for this application.
     */
    public function getNextSchedule(): ?array
    {
        return $this->schedule ? $this->schedule->getUpcomingSchedule() : null;
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