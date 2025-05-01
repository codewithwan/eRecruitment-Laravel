<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vacancies extends Model
{
    use HasFactory;
    
    // Explicitly set the table name to ensure consistency
    protected $table = 'vacancies';
    
    protected $fillable = [
        'user_id',
        'title',
        'department',
        'location',
        'requirements',
        'benefits',
        'start_date',
        'end_date',
        'company_id'
    ];
    
    protected $casts = [
        'requirements' => 'array',
        'benefits' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
    
    /**
     * Get the periods associated with this vacancy.
     */
    public function periods()
    {
        return $this->hasMany(Period::class, 'vacancies_id');
    }

    /**
     * Get the company associated with this vacancy.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
