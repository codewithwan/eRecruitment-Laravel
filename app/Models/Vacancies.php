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
        'department_id',
        'major_id',
        'location',
        'salary',
        'company_id',
        'requirements',
        'benefits',
        'question_pack_id',
        'education_level_id',
        'vacancy_type_id',
        'job_description'
    ];
    
    protected $casts = [
        'requirements' => 'array',
        'benefits' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
    
    /**
     * Get the periods associated with this vacancy.
     */
    public function periods()
    {
        return $this->belongsToMany(Period::class, 'vacancy_periods', 'vacancy_id', 'period_id');
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
    public function applications()
    {
        return $this->hasManyThrough(
            Application::class,
            VacancyPeriods::class,
            'vacancy_id', // Foreign key on vacancy_periods table
            'vacancy_period_id', // Foreign key on applicants table
            'id', // Local key on vacancies table
            'id' // Local key on vacancy_periods table
        );
    }

    /**
     * Get the user who created this vacancy.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get the department associated with this vacancy.
     */
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }
    
    /**
     * Get the major associated with this vacancy.
     */
    public function major()
    {
        return $this->belongsTo(MasterMajor::class, 'major_id');
    }
    
    /**
     * Get the vacancy type associated with this vacancy.
     */
    public function vacancyType()
    {
        return $this->belongsTo(VacancyType::class, 'vacancy_type_id');
    }
    
    /**
     * Get the education level associated with this vacancy.
     */
    public function educationLevel()
    {
        return $this->belongsTo(EducationLevel::class, 'education_level_id');
    }
}
