<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'logo',
        'description',
    ];

    /**
     * Get the vacancies associated with the company.
     */
    public function vacancies(): HasMany
    {
        return $this->hasMany(Vacancy::class);
    }

    /**
     * Get the administrations associated with the company.
     */
    public function administrations(): HasMany
    {
        return $this->hasMany(Administration::class);
    }

    /**
     * Get the candidates associated with the company.
     */
    public function candidates(): HasMany
    {
        return $this->hasMany(Candidate::class);
    }
}
