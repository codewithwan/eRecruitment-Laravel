<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
     * Get the vacancies that belong to this period.
     */
    public function vacancies()
    {
        return $this->belongsToMany(Vacancies::class, 'vacancy_period', 'period_id', 'vacancy_id');
    }
    
    /**
     * Get the applicants that belong to this period through the vacancy_period table.
     */
    public function applicants()
    {
        return $this->hasManyThrough(
            Applicant::class,
            VacancyPeriod::class,
            'period_id', // Foreign key on vacancy_period table
            'vacancy_period_id', // Foreign key on applicants table
            'id', // Local key on periods table
            'id' // Local key on vacancy_period table
        );
    }
}
