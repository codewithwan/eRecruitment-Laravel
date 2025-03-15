<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assessment extends Model
{
    protected $fillable = [
        'joblisting_id',
        'title',
        'description',
        'created_at',
    ];

    // Relasi : 1 Assessment dimiliki oleh 1 Job
    public function joblistings()
    {
        return $this->belongsTo(JobListing::class, 'joblisting_id');
    }

    // Relasi : 1 Assessment memiliki banyak soal
    public function questions()
    {
        return $this->hasMany(Question::class, 'assessment_id');
    }
}

