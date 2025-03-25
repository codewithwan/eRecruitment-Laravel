<?php

namespace Database\Factories;

use App\Models\Assessment;
use App\Models\Question;
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
            'assessment_id' => Assessment::factory(),
            'question_text' => $this->faker->sentence(10, true) . '?',
            'options' => $this->generateOptions(),
        ];
    }

    /**
     * Generate random options for multiple choice questions
     *
     * @return array
     */
    protected function generateOptions()
    {
        $numOptions = $this->faker->numberBetween(2, 5);
        $options = [];
        
        for ($i = 0; $i < $numOptions; $i++) {
            $options[] = $this->faker->sentence(3, true);
        }
        
        return $options;
    }
}
