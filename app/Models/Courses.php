<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Courses extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_name',
        'certificate_file'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
