<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobTypes extends Model
{
     use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function vacancies()
    {
        return $this->hasMany(Vacancies::class, 'type_id');
    }
}
