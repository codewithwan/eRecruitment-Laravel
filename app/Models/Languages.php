<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Languages extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'language_name',
        'certificate_file'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
