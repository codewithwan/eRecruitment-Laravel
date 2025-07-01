<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EducationLevel extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        //
    ];

    /**
     * Get the vacancies that require this education level.
     */
    public function vacancies(): HasMany
    {
        return $this->hasMany(Vacancies::class);
    }

    /**
     * Get the candidates education records with this level.
     */
    public function candidatesEducations(): HasMany
    {
        return $this->hasMany(CandidatesEducation::class, 'education_level_id');
    }

    /**
     * Scope to order by name alphabetically.
     */
    public function scopeOrderByName($query)
    {
        return $query->orderBy('name');
    }
}
