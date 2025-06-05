<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Periods extends Model
{
    protected $fillable = [
        'name',
        'description',
        'start_time',
        'end_time',
    ];

    public function vacancyPeriods()
    {
        return $this->hasMany(VacanciesPeriods::class, 'period_id');
    }
}
