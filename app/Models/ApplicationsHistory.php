<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApplicationsHistory extends Model
{
    protected $table = 'application_history';

    protected $fillable = [
        'application_id',
        'selection_id',
        'assessments_id',
        'interviews_id',
        'reviewed_by',
        'statuses_id',
        'is_qualified',
    ];

    // Relasi ke tabel lain (jika ingin)
    public function application()
    {
        return $this->belongsTo(Applications::class, 'application_id');
    }

    public function status()
    {
        return $this->belongsTo(Statuses::class, 'statuses_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
