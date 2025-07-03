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
        'final_decision',
        'decision_made_by',
        'decision_made_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'overall_score' => 'decimal:2',
        'decision_made_at' => 'datetime',
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
     * Calculate overall score from application history.
     */
    public function calculateOverallScore(): ?float
    {
        $historyScores = $this->application->history()
            ->whereNotNull('score')
            ->pluck('score')
            ->toArray();

        if (empty($historyScores)) {
            return null;
        }

        return round(array_sum($historyScores) / count($historyScores), 2);
    }

    /**
     * Generate report summary.
     */
    public function generateSummary(): array
    {
        $historyRecords = $this->application->history()->with('status')->get();
        
        return [
            'total_stages_completed' => $historyRecords->whereNotNull('score')->count(),
            'decision_status' => $this->final_decision,
            'overall_performance' => $this->getOverallPerformanceRating(),
            'stages_completed' => $historyRecords->pluck('status.name')->toArray(),
        ];
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