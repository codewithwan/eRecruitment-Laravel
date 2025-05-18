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
     * Get the applicants that belong to this period.
     */
    public function applicants()
    {
        return $this->hasMany(Applicant::class, 'period_id');
    }
}
