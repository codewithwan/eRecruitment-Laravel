<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'created_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    //Relasi : Seorang admin bisa membuat banyak rekruitmen
    public function joblistings()
    {
        return $this->hasMany(JobListing::class, 'created_by');
    }

    // 1 User hanya bisa menjadi 1 Candidate
    public function candidates()
    {
        return $this->hasOne(candidate::class, 'user_id');
    }
    
    // Admin/Kepala Divisi bisa meninjau lamaran
    public function applications()
    {
        return $this->hasMany(interviews::class, 'interviewer_id');
    }
    
}
