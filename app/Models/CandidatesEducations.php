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
        'major_id', // ubah dari 'major' ke 'major_id'
        'institution_id', // ubah dari institution_name ke institution_id
        'gpa',
        'year_in',
        'year_out'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function major()
    {
        return $this->belongsTo(MasterMajor::class, 'major_id');
    }

    public function institution()
    {
        return $this->belongsTo(\App\Models\MasterInstitution::class, 'institution_id');
    }
}
