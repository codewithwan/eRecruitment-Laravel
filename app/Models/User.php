<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

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
            'role' => UserRole::class,
        ];
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'user_id');
    }

    public function candidatesProfile()
    {
        return $this->hasOne(CandidatesProfile::class);
    }

    public function candidatesEducations()
    {
        return $this->hasMany(CandidatesEducation::class);
    }

    public function candidatesWorkExperiences()
    {
        return $this->hasMany(CandidatesWorkExperience::class);
    }

    public function candidatesSkills()
    {
        return $this->hasMany(CandidatesSkill::class);
    }

    public function candidatesLanguages()
    {
        return $this->hasMany(CandidatesLanguage::class);
    }

    public function candidatesCourses()
    {
        return $this->hasMany(CandidatesCourse::class);
    }

    public function candidatesCertifications()
    {
        return $this->hasMany(CandidatesCertification::class);
    }

    public function candidatesEnglishCertifications()
    {
        return $this->hasMany(CandidatesEnglishCertification::class);
    }

    public function candidatesOrganizations()
    {
        return $this->hasMany(CandidatesOrganization::class);
    }

    public function candidatesAchievements()
    {
        return $this->hasMany(CandidatesAchivement::class);
    }

    public function candidatesSocialMedia()
    {
        return $this->hasMany(CandidatesSocialMedia::class);
    }

    public function candidatesCV()
    {
        return $this->hasOne(CandidatesCV::class);
    }
}
