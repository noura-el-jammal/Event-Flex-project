<?php

namespace Database\Factories;

use App\Models\Commantaire;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommantaireFactory extends Factory
{
    protected $model = Commantaire::class;

    public function definition(): array
    {
        return [
            'contenu' => $this->faker->sentence(10),
            'date_envoi' => $this->faker->dateTimeThisYear(),
            'id_utilisateur' => \App\Models\User::factory(),
            'id_Programme' => \App\Models\Programme::factory(),
        ];
    }
}
