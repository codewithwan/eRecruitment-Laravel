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
        'requirements',
        'job_description',
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
}
