<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidatesProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'no_ektp',
        'gender',
        'phone_number',
        'npwp',
        'about_me',
        'place_of_birth',
        'date_of_birth',
        'address',
        'province',
        'city',
        'district',
        'village',
        'rt',
        'rw',
        'profile_image',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
