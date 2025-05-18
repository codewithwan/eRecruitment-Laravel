<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_text',
        'options',
        'correct_answer',
        'question_type'
    ];

    protected $casts = [
        'options' => 'array',
    ];

    /**
     * The question packs that belong to the question.
     */
    public function questionPacks(): BelongsToMany
    {
        return $this->belongsToMany(QuestionPack::class, 'pack_question', 'question_id', 'question_pack_id');
    }
}