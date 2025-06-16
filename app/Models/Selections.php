<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Selections extends Model
{
    protected $table = 'selection';

    protected $fillable = [
        'name',
        'description'
    ];

    // Relasi ke Applications
    public function applications()
    {
        return $this->hasMany(Applications::class, 'selection_id');
    }

    // Relasi ke ApplicationHistory
    public function applicationHistories()
    {
        return $this->hasMany(ApplicationsHistory::class, 'selection_id');
    }
}
