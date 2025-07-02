<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationHistory extends Model
{
    use HasFactory;

    protected $table = 'application_history';

    protected $fillable = [
        'application_id',
        'status_id',
        'processed_at',
        'score',
        'notes',
        'scheduled_at',
        'completed_at',
        'reviewed_by',
        'reviewed_at',
        'is_active',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
        'scheduled_at' => 'datetime',
        'completed_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'score' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
} 