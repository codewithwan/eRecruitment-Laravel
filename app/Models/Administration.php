<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Administration extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'candidate_id',
        'vacancy_id',
        'period_id',
    ];

    /**
     * Get the company that owns the administration record.
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the candidate that owns the administration record.
     */
    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class);
    }

    /**
     * Get the vacancy that owns the administration record.
     */
    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class);
    }

    /**
     * Get the period that owns the administration record.
     */
    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }
}
