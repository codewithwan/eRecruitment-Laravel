<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class QuestionPack extends Model
{
    use HasFactory;

    protected $fillable = [
        'pack_name',
        'description',
        'test_type',
        'duration',
        'user_id',
        'status'
    ];

    /**
     * The questions that belong to the question pack.
     */
    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(Question::class, 'pack_question', 'question_pack_id', 'question_id');
    }
}