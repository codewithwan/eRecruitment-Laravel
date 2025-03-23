<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vacancies extends Model
{
    protected $fillable = [
        'title',
        'department',
        'location',
        'requirements',
        'benefits',
        'user_id',
    ];

    protected $casts = [
        'requirements' => 'array',
        'benefits' => 'array',
    ];

    /**
     * Get the user that created this job.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function candidates()
    {
        return $this->hasMany(Candidate::class, 'vacancy_id');
    }
}
