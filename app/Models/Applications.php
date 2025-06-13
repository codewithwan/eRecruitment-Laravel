<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Applications extends Model
{
    protected $fillable = [
        'user_id',
        'vacancies_id',
        'selection_id',
        'resume_path',
        'cover_letter_path',
    ];

    /**
     * Relasi ke user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke lowongan
     * Pastikan menggunakan nama kolom yang benar (vacancies_id)
     */
    public function vacancy()
    {
        return $this->belongsTo(Vacancies::class, 'vacancies_id');
    }

    /**
     * Alias untuk relasi vacancy, untuk kompatibilitas dengan kode yang menggunakan job
     */
    public function job()
    {
        return $this->belongsTo(Vacancies::class, 'vacancies_id');
    }

    /**
     * Relasi ke selection (replacing status relation)
     */
    public function selection()
    {
        return $this->belongsTo(Selections::class, 'selection_id');
    }
}
