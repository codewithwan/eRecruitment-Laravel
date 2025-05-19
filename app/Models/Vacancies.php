<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vacancies extends Model
{
    use HasFactory;
    
    // Explicitly set the table name to ensure consistency
    protected $table = 'vacancies';
    
    protected $fillable = [
        'user_id',
        'title',
        'department',
        'location',
        'salary',
        'requirements',
        'benefits',
        'question_pack_id',
        'company_id'
    ];
    
    protected $casts = [
        'requirements' => 'array',
        'benefits' => 'array',
    ];
    
    /**
     * Get the periods associated with this vacancy.
     */
    public function periods()
    {
        return $this->belongsToMany(Period::class, 'vacancy_period', 'vacancy_id', 'period_id');
    }

    /**
     * Get the company associated with this vacancy.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
    
    /**
     * Get the question pack associated with this vacancy.
     */
    public function questionPack()
    {
        return $this->belongsTo(QuestionPack::class);
    }
    
    /**
     * Get the applicants associated with this vacancy through the vacancy_period table.
     */
    public function applicants()
    {
        return $this->hasManyThrough(
            Applicant::class,
            VacancyPeriod::class,
            'vacancy_id', // Foreign key on vacancy_period table
            'vacancy_period_id', // Foreign key on applicants table
            'id', // Local key on vacancies table
            'id' // Local key on vacancy_period table
        );
    }
}
