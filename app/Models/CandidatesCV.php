<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidatesCV extends Model
{
    use HasFactory;

    protected $table = 'candidates_cvs';

    protected $fillable = [
        'user_id',
        'cv_filename',
        'cv_path',
        'download_count',
        'last_downloaded_at',
        'cv_data_snapshot',
        'is_active',
    ];

    protected $casts = [
        'download_count' => 'integer',
        'last_downloaded_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
