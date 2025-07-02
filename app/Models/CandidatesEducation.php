<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidatesEducation extends Model
{
    use HasFactory;

    protected $table = 'candidates_educations';

    protected $fillable = [
        'user_id',
        'education_level_id',
        'faculty',
        'major_id',
        'institution_name',
        'gpa',
        'year_in',
        'year_out',
    ];

    protected $casts = [
        'gpa' => 'decimal:2',
        'year_in' => 'integer',
        'year_out' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function major()
    {
        return $this->belongsTo(MasterMajor::class, 'major_id');
    }

    public function educationLevel()
    {
        return $this->belongsTo(EducationLevel::class, 'education_level_id');
    }
}
