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
        'is_qualified',
        'notes',
        'created_by'
    ];

    // Relasi ke Application
    public function application()
    {
        return $this->belongsTo(Applications::class, 'application_id');
    }

    // Relasi ke reviewer (User)
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
