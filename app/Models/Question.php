<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_text',
        'question_type'
    ];

    /**
     * The question packs that belong to the question.
     */
    public function questionPacks(): BelongsToMany
    {
        return $this->belongsToMany(QuestionPack::class, 'pack_question', 'question_id', 'question_pack_id');
    }

    /**
     * The choices that belong to the question.
     */
    public function choices(): HasMany
    {
        return $this->hasMany(Choice::class);
    }

    /**
     * Get the correct choice for this question.
     */
    public function correctChoice()
    {
        return $this->choices()->where('is_correct', true)->first();
    }
}