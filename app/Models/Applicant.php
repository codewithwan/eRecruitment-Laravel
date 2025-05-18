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
        'vacancy_id',
        'status_id',
        'period_id',
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
     * Get the vacancy that the user applied to.
     */
    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancies::class, 'vacancy_id');
    }
    
    /**
     * Get the status of the application.
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }
    
    /**
     * Get the recruitment period for this application.
     */
    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }
}
