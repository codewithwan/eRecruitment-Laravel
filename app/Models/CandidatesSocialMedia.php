<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidatesSocialMedia extends Model
{
    protected $fillable = [
        'user_id',
        'platform_name',
        'url'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
