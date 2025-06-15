<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidatesOrganizations extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'organization_name',
        'position',
        'start_month',
        'start_year',
        'end_month',
        'end_year',
        'description',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_year' => 'integer',
        'end_year' => 'integer'
    ];
}
