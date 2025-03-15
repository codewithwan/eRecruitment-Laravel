<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'candidate_id',
        'joblisting_id',
        'status',
        'reviewer_by',
        'created_at',
    ];

    // Relasi : Lamaran terkait dengan 1 Job
    public function joblistings()
    {
        return $this->belongsTo(JobListing::class, 'joblisting_id');
    }

    // Relasi : Lamaran diajukan oleh Candidate
    public function candidate()
    {
        return $this->belongsTo(Candidate::class, 'candidate_id');
    }

    // Relasi : Lamaran di-review oleh admin/kepala divisi
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_by');
    }

    // Relasi : 1 Lamaran bisa memiliki 1 interview
    public function interview()
    {
        return $this->hasOne(Interviews::class);
    }
}
