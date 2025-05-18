<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Companies extends Model
{
    use HasFactory;


    protected $fillable = [
        'name',
        'description',
        'logo',
    ];

    public function vacancies()
    {
        return $this->hasMany(Vacancies::class, 'company_id');
    }
}
