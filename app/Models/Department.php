<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Vacancies;

class Department extends Model
{
    use HasFactory;
    protected $table = 'department';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
    ];

    /**
     * Get the vacancies associated with the department.
     */
    public function vacancies(): HasMany
    {
        return $this->hasMany(Vacancies::class);
    }

}
