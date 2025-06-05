<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CandidateCV extends Model
{
    use HasFactory;

    protected $table = 'candidate_cvs';
    
    protected $fillable = [
        'user_id',
        'cv_filename',
        'cv_path',
        'download_count',
        'last_downloaded_at',
        'cv_data_snapshot',
        'is_active'
    ];

    protected $casts = [
        'cv_data_snapshot' => 'array',
        'last_downloaded_at' => 'datetime',
        'is_active' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function getFormattedCreatedAtAttribute()
    {
        return $this->created_at->format('d M Y H:i');
    }

    public function getFormattedLastDownloadedAtAttribute()
    {
        return $this->last_downloaded_at ? $this->last_downloaded_at->format('d M Y H:i') : 'Belum pernah';
    }
}