<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CandidatesEducations extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id',
        'education_level',
        'faculty',
        'major',
        'institution_name',
        'gpa',
        'year_in',
        'year_out'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
