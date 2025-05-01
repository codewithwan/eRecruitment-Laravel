<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vacancy extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'vacancies';
    
    protected $fillable = [
        'title',
        'department',
        'location',
        'requirements',
        'benefits',
        'applicants',
        'company_id',
        'user_id',
    ];

    protected $casts = [
        'requirements' => 'array',
        'benefits' => 'array',
        'applicants' => 'array',
    ];

    /**
     * Get the user that created this job.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the company this vacancy belongs to.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get candidates applying for this vacancy.
     */
    public function candidates()
    {
        return $this->hasMany(Candidate::class, 'vacancies_id');
    }
    
    /**
     * Get administrations associated with this vacancy.
     */
    public function administrations(): HasMany
    {
        return $this->hasMany(Administration::class, 'vacancies_id');
    }
}
