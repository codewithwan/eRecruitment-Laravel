<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $fillable = [
        // ...field lain...
        'major_id',
        'company_id',
    ];

    public function major()
    {
        return $this->belongsTo(\App\Models\MasterMajor::class, 'major_id');
    }

    public function company()
    {
        return $this->belongsTo(\App\Models\Companies::class, 'company_id');
    }
}
