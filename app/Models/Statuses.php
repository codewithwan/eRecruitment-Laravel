<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Statuses extends Model
{
    protected $table = 'statuses';
    
    protected $fillable = [
        'name',
        'color'
    ];
    
    // Relasi ke Applications
    public function applications()
    {
        return $this->hasMany(Applications::class, 'status_id');
    }
    
    // Relasi ke ApplicationHistory jika diperlukan
    public function applicationHistories()
    {
        return $this->hasMany(ApplicationsHistory::class, 'statuses_id');
    }
}
