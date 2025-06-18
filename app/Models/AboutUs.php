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
        return $this->belongsTo(Company::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }
}
