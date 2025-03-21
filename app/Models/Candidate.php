<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    protected $fillable = ['user_id', 'vacancy_id', 'applied_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function vacancy()
    {
        return $this->belongsTo(Vacancies::class, 'vacancy_id');
    }

    public function stages()
    {
        return $this->hasMany(RecruitmentStage::class);
    }
}
