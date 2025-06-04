<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnglishCertifications extends Model
{
    use HasFactory;

    protected $table = 'english_certifications';
    
    protected $fillable = [
        'user_id',
        'name', // Pastikan 'name' ada di fillable
        'certificate_file'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
