<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'application_data',
        'test_results',
        'interview_notes',
        'applied_at',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'application_data' => 'array',
        'test_results' => 'array',
        'interview_notes' => 'array',
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
        // We need to use hasManyThrough or a dynamic property here
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
        // We need to use hasManyThrough or a dynamic property here
        return $this->vacancyPeriod ? $this->vacancyPeriod->period : null;
    }
}
