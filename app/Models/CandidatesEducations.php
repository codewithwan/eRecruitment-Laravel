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
        'major_id', // tetap mereferensi ke master_majors
        'institution_name', // ubah kembali dari institution_id ke institution_name
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

    // Hapus relasi institution karena tidak lagi menggunakan master institution
}
