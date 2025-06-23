<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationReport extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'application_reports';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'application_id',
        'overall_score',
        'final_notes',
        'rejection_reason',
        'recommendation',
        'final_decision',
        'decision_made_by',
        'decision_made_at',
        'report_generated_by',
        'report_generated_at',
        'administration_score',
        'assessment_score',
        'interview_score',
        'stage_summary',
        'strengths',
        'weaknesses',
        'next_steps',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'overall_score' => 'decimal:2',
        'administration_score' => 'decimal:2',
        'assessment_score' => 'decimal:2',
        'interview_score' => 'decimal:2',
        'decision_made_at' => 'datetime',
        'report_generated_at' => 'datetime',
        'stage_summary' => 'array',
        'strengths' => 'array',
        'weaknesses' => 'array',
    ];

    /**
     * Get the application that owns this report.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Get the user who made the final decision.
     */
    public function decisionMaker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'decision_made_by');
    }

    /**
     * Get the user who generated the report.
     */
    public function reportGenerator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'report_generated_by');
    }

    /**
     * Check if the final decision is accepted.
     */
    public function isAccepted(): bool
    {
        return $this->final_decision === 'accepted';
    }

    /**
     * Check if the final decision is rejected.
     */
    public function isRejected(): bool
    {
        return $this->final_decision === 'rejected';
    }

    /**
     * Check if the final decision is still pending.
     */
    public function isPending(): bool
    {
        return $this->final_decision === 'pending';
    }

    /**
     * Calculate overall score from stage scores.
     */
    public function calculateOverallScore(): ?float
    {
        $scores = array_filter([
            $this->administration_score,
            $this->assessment_score,
            $this->interview_score,
        ]);

        if (empty($scores)) {
            return null;
        }

        return round(array_sum($scores) / count($scores), 2);
    }

    /**
     * Generate report summary.
     */
    public function generateSummary(): array
    {
        return [
            'total_stages_completed' => count(array_filter([
                $this->administration_score,
                $this->assessment_score,
                $this->interview_score,
            ])),
            'highest_score_stage' => $this->getHighestScoreStage(),
            'lowest_score_stage' => $this->getLowestScoreStage(),
            'decision_status' => $this->final_decision,
            'overall_performance' => $this->getOverallPerformanceRating(),
        ];
    }

    /**
     * Get the stage with the highest score.
     */
    private function getHighestScoreStage(): ?string
    {
        $scores = [
            'administration' => $this->administration_score,
            'assessment' => $this->assessment_score,
            'interview' => $this->interview_score,
        ];

        $scores = array_filter($scores);
        
        if (empty($scores)) {
            return null;
        }

        return array_search(max($scores), $scores);
    }

    /**
     * Get the stage with the lowest score.
     */
    private function getLowestScoreStage(): ?string
    {
        $scores = [
            'administration' => $this->administration_score,
            'assessment' => $this->assessment_score,
            'interview' => $this->interview_score,
        ];

        $scores = array_filter($scores);
        
        if (empty($scores)) {
            return null;
        }

        return array_search(min($scores), $scores);
    }

    /**
     * Get overall performance rating based on score.
     */
    private function getOverallPerformanceRating(): ?string
    {
        if (!$this->overall_score) {
            return null;
        }

        if ($this->overall_score >= 85) {
            return 'Excellent';
        } elseif ($this->overall_score >= 75) {
            return 'Very Good';
        } elseif ($this->overall_score >= 65) {
            return 'Good';
        } elseif ($this->overall_score >= 55) {
            return 'Fair';
        } else {
            return 'Poor';
        }
    }
} 