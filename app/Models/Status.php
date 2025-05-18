<?php

namespace App\Models;

use App\Enums\CandidatesStage;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Status extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'code',
        'description',
        'stage',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'stage' => CandidatesStage::class,
        'is_active' => 'boolean',
    ];

    /**
     * Get the applicants with this status.
     */
    public function applicants(): HasMany
    {
        return $this->hasMany(Applicant::class, 'status_id');
    }
}
