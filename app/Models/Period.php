<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Period extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_time',
        'end_time',
    ];

    /**
     * Get the company that owns the period.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the vacancies that belong to this period.
     */
    public function vacancies(): BelongsToMany
    {
        return $this->belongsToMany(Vacancies::class, 'vacancy_periods', 'period_id', 'vacancy_id');
    }
    
    /**
     * Get the applicants that belong to this period through the vacancy_period table.
     */
    public function applications()
    {
        return $this->hasManyThrough(
            Application::class,
            VacancyPeriods::class,
            'period_id', // Foreign key on vacancy_periods table
            'vacancy_period_id', // Foreign key on applicants table
            'id', // Local key on periods table
            'id' // Local key on vacancy_periods table
        );
    }
}
