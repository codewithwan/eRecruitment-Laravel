<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterMajor extends Model
{
    use HasFactory;

    protected $table = 'master_majors';

    protected $fillable = [
        'name'
    ];

    public function candidatesEducations()
    {
        return $this->hasMany(CandidatesEducations::class, 'major_id');
    }
}
