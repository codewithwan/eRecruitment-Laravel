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
}
