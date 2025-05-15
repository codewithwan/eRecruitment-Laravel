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
     * Get the candidates associated with this vacancy.
     */
    public function candidates()
    {
        return $this->hasMany(Candidate::class, 'vacancy_id');
    }
}
