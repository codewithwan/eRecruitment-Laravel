<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PsychometricTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
    ];
}
