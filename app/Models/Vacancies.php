<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vacancies extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'location',
        'type_id',
        'company_id',
        'department_id',
        'major_id',
        'requirements',
        'job_description',
        'benefits',
        'user_id',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'requirements' => 'array',
        'benefits' => 'array',
    ];

    /**
     * Relasi ke perusahaan
     */
    public function company()
    {
        return $this->belongsTo(Companies::class, 'company_id');
    }

    /**
     * Relasi ke tipe pekerjaan
     */
    public function jobType()
    {
        return $this->belongsTo(JobTypes::class, 'type_id');
    }

    /**
     * Relasi ke departemen
     */
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    /**
     * Relasi ke jurusan
     */
    public function major()
    {
        return $this->belongsTo(MasterMajor::class, 'major_id');
    }
}
