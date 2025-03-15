<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Choice extends Model
{
    protected $fillable = [
        'question_id',
        'question',
        'is_correct',
    ];

    // Relasi : 1 Pilihan jawaban dimiliki oleh 1 Soal
    public function questions()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }
}
