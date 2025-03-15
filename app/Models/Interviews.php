<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Interviews extends Model
{
    protected $fillable = [
        'candidate_id',
        'job_id',
        'interviewer_id',
        'interview_date',
        'status',
        'created_at',
    ];

    // Relasi : 1 Interview dimiliki oleh 1 Job
    public function joblistings()
    {
        return $this->belongsTo(JobListing::class, 'joblisting_id');
    }

    // Relasi : 1 Interview dimiliki oleh 1 Candidate
    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    // Relasi : 1 Interview dimiliki oleh 1 User(ADMIN)
    public function interviewer()
    {
        return $this->belongsTo(User::class, 'interviewer_id');
    }
}
