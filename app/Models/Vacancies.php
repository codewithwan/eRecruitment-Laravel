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
        'department_id',
        'company_id',
        'type_id',
        'major_id',
        'location',
        'requirements',
        'benefits',
        'job_description',
    ];

    protected $casts = [
        'requirements' => 'array',
        'benefits' => 'array',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'company_id');
    }

    public function jobType(): BelongsTo
    {
        return $this->belongsTo(JobType::class, 'type_id');
    }

    public function major(): BelongsTo
    {
        return $this->belongsTo(MasterMajor::class, 'major_id');
    }
    
    public function periods()
    {
        return $this->belongsToMany(Periods::class, 'vacancies_periods', 'vacancy_id', 'period_id')
            ->withTimestamps();
    }
}
