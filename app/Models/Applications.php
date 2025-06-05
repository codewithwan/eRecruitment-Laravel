<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Applications extends Model
{
    protected $fillable = [
        'user_id',
        'vacancies_id',
        'status_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancies::class, 'vacancies_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Statuses::class, 'status_id');
    }
}
