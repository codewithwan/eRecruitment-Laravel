<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'assessment_id',
        'question',
        'created_at',
    ];

    // Relasi : 1 Soal dimiliki oleh 1 Assessment
    public function assessment()
    {
        return $this->belongsTo(Assessment::class, 'assessment_id');
    }

    // Relasi : 1 Soal memiliki banyak pilihan jawaban
    public function choices()
    {
        return $this->hasMany(Choice::class, 'question_id');
    }
}
