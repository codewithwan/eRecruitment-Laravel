<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAnswer extends Model
{
    protected $fillable = [
        'candidate_id',
        'question_id',
        'questioin_id',
        'choice_id',
        'created_at',
    ];

    // Relasi : 1 Jawaban dimiliki oleh 1 Kandidat
    public function candidate()
    {
        return $this->belongsTo(Candidate::class, 'candidate_id');
    }

    // Relasi : 1 Jawaban dimiliki oleh 1 Pertanyaan  
    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    // Relasi : 1 Jawaban dimiliki oleh 1 Pilihan Jawaban
    public function choice()
    {
        return $this->belongsTo(Choice::class, 'choice_id');
    }
}
