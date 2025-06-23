<?php

namespace App\Models;

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
        'type',
        'order',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get the applications with this status.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'status_id');
    }

    /**
     * Get the applications in this stage (for current_stage_id).
     */
    public function currentStageApplications(): HasMany
    {
        return $this->hasMany(Application::class, 'current_stage_id');
    }

    /**
     * Scope to get only stages.
     */
    public function scopeStages($query)
    {
        return $query->where('type', 'stage')->orderBy('order');
    }

    /**
     * Scope to get only statuses.
     */
    public function scopeStatuses($query)
    {
        return $query->where('type', 'status');
    }

    /**
     * Check if this is a stage.
     */
    public function isStage(): bool
    {
        return $this->type === 'stage';
    }

    /**
     * Check if this is a status.
     */
    public function isStatus(): bool
    {
        return $this->type === 'status';
    }
}
