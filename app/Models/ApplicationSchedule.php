<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationSchedule extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'application_schedules';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'application_id',
        
        // Test scheduling
        'test_scheduled_at',
        'test_type',
        'test_scheduled_by',
        
        // Interview scheduling
        'interview_scheduled_at',
        'interview_location',
        'is_interview_online',
        'company_id',
        'interview_scheduled_by',
        
        // Status tracking
        'test_attendance_confirmed',
        'interview_attendance_confirmed',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'test_scheduled_at' => 'datetime',
        'interview_scheduled_at' => 'datetime',
        'is_interview_online' => 'boolean',
        'test_attendance_confirmed' => 'boolean',
        'interview_attendance_confirmed' => 'boolean',
    ];

    /**
     * Get the application that owns this schedule.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Get the company where the offline interview will take place.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the user who scheduled the test.
     */
    public function testScheduler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'test_scheduled_by');
    }
    
    /**
     * Get the user who scheduled the interview.
     */
    public function interviewScheduler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'interview_scheduled_by');
    }
    
    /**
     * Check if the test is scheduled.
     */
    public function isTestScheduled(): bool
    {
        return $this->test_scheduled_at !== null;
    }
    
    /**
     * Check if the interview is scheduled.
     */
    public function isInterviewScheduled(): bool
    {
        return $this->interview_scheduled_at !== null;
    }

    /**
     * Get the formatted interview location.
     */
    public function getInterviewLocationAttribute($value): string
    {
        if ($this->is_interview_online) {
            return $value ?? 'Online Meeting';
        } else {
            if ($this->company) {
                return $value ?? $this->company->name;
            }
            return $value ?? 'To be determined';
        }
    }
    
    /**
     * Get the question pack from the vacancy relation.
     */
    public function getQuestionPackAttribute()
    {
        if (!$this->application || !$this->application->vacancyPeriod || !$this->application->vacancyPeriod->vacancy) {
            return null;
        }
        
        $vacancy = $this->application->vacancyPeriod->vacancy;
        return $vacancy->questionPack ?? null;
    }
    
    /**
     * Get the upcoming schedule (test or interview).
     */
    public function getUpcomingSchedule(): ?array
    {
        $now = now();
        
        if ($this->test_scheduled_at && $this->test_scheduled_at->gt($now)) {
            $questionPack = $this->question_pack;
            return [
                'type' => 'test',
                'datetime' => $this->test_scheduled_at,
                'test_type' => $this->test_type ?? ($questionPack ? $questionPack->test_type : null),
                'question_pack' => $questionPack ? $questionPack->pack_name : null,
            ];
        }
        
        if ($this->interview_scheduled_at && $this->interview_scheduled_at->gt($now)) {
            return [
                'type' => 'interview',
                'datetime' => $this->interview_scheduled_at,
                'location' => $this->interview_location,
                'is_online' => $this->is_interview_online,
                'company' => $this->company ? $this->company->name : null,
            ];
        }
        
        return null;
    }
} 