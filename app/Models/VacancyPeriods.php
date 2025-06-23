<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VacancyPeriods extends Model
{
    use HasFactory;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'vacancy_periods';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'vacancy_id',
        'period_id',
    ];
    
    /**
     * Get the vacancy that belongs to this relationship.
     */
    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancies::class, 'vacancy_id');
    }
    
    /**
     * Get the period that belongs to this relationship.
     */
    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class, 'period_id');
    }
    
    /**
     * Get the applicants for this vacancy-period combination.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'vacancy_period_id');
    }
}
