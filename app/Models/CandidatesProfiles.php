<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CandidatesProfiles extends Model
{
    use HasFactory;

    protected $table = 'candidate_profiles';

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
    ];

    protected $casts = [
        'date_of_birth' => 'date'
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
