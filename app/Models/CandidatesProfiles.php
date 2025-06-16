<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Exception;

class CandidatesProfiles extends Model
{
    use HasFactory;

    protected $table = 'candidates_profiles';  // Explicitly set the table name

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
        'profile_image', // Tambah profile_image ke fillable
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Store or update candidate profile data
     */
    public static function storeProfile($userData, $userId)
    {
        try {
            DB::beginTransaction();

            // Log input data
            \Log::info('Attempting to save profile data:', [
                'user_id' => $userId,
                'data' => $userData
            ]);

            // Gender sudah langsung disimpan sebagai string

            $profile = self::updateOrCreate(
                ['user_id' => $userId],
                array_merge($userData, ['user_id' => $userId])
            );

            DB::commit();

            \Log::info('Profile saved successfully:', $profile->toArray());

            return [
                'success' => true,
                'profile' => $profile,
                'message' => 'Data pribadi berhasil disimpan'
            ];

        } catch (Exception $e) {
            DB::rollBack();
            \Log::error('Error saving profile: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get profile image URL
     */
    public function getProfileImageUrlAttribute()
    {
        if ($this->profile_image) {
            return \Storage::disk('public')->url($this->profile_image);
        }
        return null;
    }
}
