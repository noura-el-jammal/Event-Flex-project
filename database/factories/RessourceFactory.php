<?php

namespace Database\Factories;

use App\Models\Ressource;
use Illuminate\Database\Eloquent\Factories\Factory;

class RessourceFactory extends Factory
{
    protected $model = Ressource::class;

    public function definition(): array
    {
        return [
            'url_fichier' => $this->faker->url(),
            'id_Programme' => \App\Models\Programme::factory(),
        ];
    }
}
