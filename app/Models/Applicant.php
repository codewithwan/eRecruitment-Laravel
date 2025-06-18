<?php

namespace App\Models;

use App\Enums\CandidatesStage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Applicant extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'vacancy_period_id',
        'status_id',
        'current_stage',
        'applied_at',
        
        // Administrative Selection
        'admin_score',
        'admin_notes',
        'admin_reviewed_at',
        'admin_reviewed_by',
        
        // Assessment/Psychotest
        'test_score',
        'test_notes',
        'test_scheduled_at',
        'test_completed_at',
        
        // Interview
        'interview_score',
        'interview_notes',
        'interview_scheduled_at',
        'interview_completed_at',
        'interviewer_id',
        
        // Final decision
        'rejection_reason',
        'decision_made_at',
        'decision_made_by',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'current_stage' => CandidatesStage::class,
        'admin_score' => 'decimal:2',
        'test_score' => 'decimal:2',
        'interview_score' => 'decimal:2',
        'applied_at' => 'datetime',
        'admin_reviewed_at' => 'datetime',
        'test_scheduled_at' => 'datetime',
        'test_completed_at' => 'datetime',
        'interview_scheduled_at' => 'datetime',
        'interview_completed_at' => 'datetime',
        'decision_made_at' => 'datetime',
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
     * Get the admin who reviewed the application.
     */
    public function adminReviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_reviewed_by');
    }
    
    /**
     * Get the interviewer.
     */
    public function interviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'interviewer_id');
    }
    
    /**
     * Get the user who made the final decision.
     */
    public function decisionMaker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'decision_made_by');
    }
    
    /**
     * Get all stage history records for this applicant.
     */
    public function stageHistories(): HasMany
    {
        return $this->hasMany(ApplicantStageHistory::class)->orderBy('changed_at');
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
    public function addStageProgression(CandidatesStage $fromStage, CandidatesStage $toStage, ?string $notes = null, ?int $userId = null): void
    {
        ApplicantStageHistory::create([
            'applicant_id' => $this->id,
            'from_stage' => $fromStage,
            'to_stage' => $toStage,
            'notes' => $notes,
            'changed_by' => $userId,
            'changed_at' => now(),
        ]);
        
        $this->update(['current_stage' => $toStage]);
    }
    
    /**
     * Get the current stage label
     */
    public function getCurrentStageLabel(): string
    {
        return $this->current_stage->label();
    }
    
    /**
     * Check if applicant is in a specific stage
     */
    public function isInStage(CandidatesStage $stage): bool
    {
        return $this->current_stage === $stage;
    }
    
    /**
     * Check if applicant has completed a specific stage
     */
    public function hasCompletedStage(CandidatesStage $stage): bool
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
        $scores = array_filter([
            $this->admin_score,
            $this->test_score,
            $this->interview_score,
        ]);
        
        return $scores ? round(array_sum($scores) / count($scores), 2) : null;
    }
}
