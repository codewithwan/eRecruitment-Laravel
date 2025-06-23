<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationStage extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'application_stages';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'application_id',
        
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
        'admin_score' => 'decimal:2',
        'test_score' => 'decimal:2',
        'interview_score' => 'decimal:2',
        'admin_reviewed_at' => 'datetime',
        'test_scheduled_at' => 'datetime',
        'test_completed_at' => 'datetime',
        'interview_scheduled_at' => 'datetime',
        'interview_completed_at' => 'datetime',
        'decision_made_at' => 'datetime',
    ];

    /**
     * Get the application that owns these stages.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
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
} 