<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certifications extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'certification_name',
        'certificate_file'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
