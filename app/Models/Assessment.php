<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assessment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'test_type',
        'duration',
    ];

    /**
     * Get the questions for the assessment.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
}
