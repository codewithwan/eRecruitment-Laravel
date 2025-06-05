<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VacanciesPeriods extends Model
{
    protected $table = 'vacancy_period';

    protected $fillable = [
        'vacancy_id',
        'period_id',
    ];

    public function period()
    {
        return $this->belongsTo(Periods::class, 'period_id');
    }
}
