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
        'location',
        'requirements',
        'benefits',
        'job_description',
        'deadline',
        'user_id',
    ];

    protected $casts = [
        'requirements' => 'array',
        'benefits' => 'array',
        'deadline' => 'datetime',
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Companies::class, 'company_id');
    }

    public function jobType(): BelongsTo
    {
        return $this->belongsTo(JobTypes::class, 'type_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
