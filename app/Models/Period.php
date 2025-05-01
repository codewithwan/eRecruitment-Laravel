<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Period extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'vacancies_id',
    ];

    /**
     * Get the vacancy that this period belongs to.
     */
    public function vacancy()
    {
        return $this->belongsTo(Vacancies::class, 'vacancies_id');
    }
}
