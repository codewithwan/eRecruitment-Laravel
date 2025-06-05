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
        'gender_id', // ubah dari 'gender' ke 'gender_id'
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
     * Get the gender that belongs to the profile.
     */
    public function gender()
    {
        return $this->belongsTo(\App\Models\MasterGender::class, 'gender_id');
    }

    /**
     * Store or update candidate profile data
     */
    public static function storeProfile($userData, $userId)
    {
        try {
            DB::beginTransaction();

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
            \Log::error('Error saving profile: ' . $e->getMessage());

            return [
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan data'
            ];
        }
    }
}
