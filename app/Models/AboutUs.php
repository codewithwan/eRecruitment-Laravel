<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutUs extends Model
{
    protected $table = 'about_us';

    protected $fillable = [
        'company_id',
        'vision',
        'mission',
    ];

    public function companies()
    {
        return $this->belongsTo(Companies::class);
    }

    public function company()
    {
        return $this->belongsTo(\App\Models\Companies::class, 'company_id');
    }
}
