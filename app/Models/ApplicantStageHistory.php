<?php

namespace App\Models;

use App\Enums\CandidatesStage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicantStageHistory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'applicant_id',
        'from_stage',
        'to_stage',
        'notes',
        'changed_by',
        'changed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'from_stage' => CandidatesStage::class,
        'to_stage' => CandidatesStage::class,
        'changed_at' => 'datetime',
    ];

    /**
     * Get the applicant that owns this stage history.
     */
    public function applicant(): BelongsTo
    {
        return $this->belongsTo(Applicant::class);
    }

    /**
     * Get the user who made the stage change.
     */
    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    /**
     * Scope to filter by applicant
     */
    public function scopeForApplicant($query, $applicantId)
    {
        return $query->where('applicant_id', $applicantId);
    }

    /**
     * Scope to filter by stage
     */
    public function scopeToStage($query, CandidatesStage $stage)
    {
        return $query->where('to_stage', $stage);
    }

    /**
     * Get stage change description
     */
    public function getStageChangeDescription(): string
    {
        return "Changed from {$this->from_stage->label()} to {$this->to_stage->label()}";
    }
}
