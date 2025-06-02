<?php

namespace Database\Factories;

use App\Models\Assessment;
use App\Models\Question;
use App\Models\Choice;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Question::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'question_text' => $this->faker->sentence(10, true) . '?',
            'question_type' => 'multiple_choice',
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Question $question) {
            $numOptions = $this->faker->numberBetween(2, 5);
            $options = [];
            for ($i = 0; $i < $numOptions; $i++) {
                $options[] = $this->faker->sentence(3, true);
            }
            $correct = $this->faker->randomElement($options);
            foreach ($options as $option) {
                Choice::create([
                    'question_id' => $question->id,
                    'choice_text' => $option,
                    'is_correct' => $option === $correct,
                ]);
            }
        });
    }
}
