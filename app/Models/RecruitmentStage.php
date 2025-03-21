<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecruitmentStage extends Model
{
    protected $fillable = [
        'user_id',
        'stage_name', 
        'status', 
        'scheduled_at',
        'duration', 
        'test_type', 
        'location', 
        'notes',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class, 'candidate_id');
    }
}
