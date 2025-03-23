<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Log;

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

    /**
     * Retrieve the model for a bound value.
     * This ensures the assessment is properly loaded with all relationships.
     *
     * @param mixed $value
     * @param string|null $field
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function resolveRouteBinding($value, $field = null)
    {
        // Add more explicit error handling
        try {
            return $this->with('questions')->findOrFail($value);
        } catch (\Exception $e) {
            Log::error('Failed to resolve route binding for Assessment: ' . $e->getMessage());
            throw $e;
        }
    }
}
