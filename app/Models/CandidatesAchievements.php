<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CandidatesAchievements extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'level',
        'month',
        'year',
        'description',
        'certificate_file',
        'supporting_file'
    ];

    protected $casts = [
        'year' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
