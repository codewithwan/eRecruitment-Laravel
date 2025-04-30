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
        'start_date',
        'end_date',
        'description',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the vacancies for this period through the pivot table.
     */
    public function vacancies(): BelongsToMany
    {
        return $this->belongsToMany(Vacancy::class, 'vacancy_periods')
            ->withTimestamps();
    }

    /**
     * Get the administrations for this period.
     */
    public function administrations(): HasMany
    {
        return $this->hasMany(Administration::class);
    }

    /**
     * Get a formatted version of the start date.
     */
    public function getFormattedStartDateAttribute(): string
    {
        return $this->start_date->format('d/m/Y');
    }

    /**
     * Get a formatted version of the end date.
     */
    public function getFormattedEndDateAttribute(): string
    {
        return $this->end_date->format('d/m/Y');
    }
}
