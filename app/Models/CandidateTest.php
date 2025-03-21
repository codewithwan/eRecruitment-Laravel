<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CandidateTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_id',
        'test_type',
        'status', // scheduled, in_progress, completed, expired
        'scheduled_date',
        'start_time',
        'end_time',
        'duration',
        'score',
        'instructions',
    ];

    protected $casts = [
        'scheduled_date' => 'datetime',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class, 'candidate_test_questions');
    }
}
