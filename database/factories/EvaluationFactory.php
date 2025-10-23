<?php

namespace Database\Factories;

use App\Models\Evaluation;
use Illuminate\Database\Eloquent\Factories\Factory;

class EvaluationFactory extends Factory
{
    protected $model = Evaluation::class;

    public function definition(): array
    {
        return [
            'id_utilisateur' => \App\Models\User::factory(),
            'id_Programme' => \App\Models\Programme::factory(),
            'note' => $this->faker->numberBetween(1, 5),
        ];
    }
}
