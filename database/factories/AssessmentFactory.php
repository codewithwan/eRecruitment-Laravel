<?php

namespace Database\Factories;

use App\Models\Assessment;
use Illuminate\Database\Eloquent\Factories\Factory;

class AssessmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Assessment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'test_type' => $this->faker->randomElement(['multiple_choice', 'essay', 'technical']),
            'duration' => sprintf("%d:%02d", $this->faker->numberBetween(0, 2), $this->faker->numberBetween(0, 59)),
        ];
    }
}
