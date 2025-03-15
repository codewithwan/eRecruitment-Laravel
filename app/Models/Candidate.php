<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'resume',
        'status',
        'created_at',
    ];

    // 1 Candidate hanya bisa menjadi 1 User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    //Relasi : Seorang Candidate bisa mengirimkan banyak lamaran
    public function applications()
    {
        return $this->hasMany(Application::class, 'candidate_id');
    }

    //Relasi : Kandidat bisa menjawab banyak pertanyaan
    public function answers()
    {
        return $this->hasMany(UserAnswer::class, 'candidate_id');
    }

}
