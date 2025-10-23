<?php

namespace Database\Factories;

use App\Models\Publication;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Evenement;

class PublicationFactory extends Factory
{
    protected $model = Publication::class;

    public function definition(): array
    {
        return [
            'contenuP' => $this->faker->sentence(10),
            'date_publication' => $this->faker->dateTimeThisMonth(),
            'image_url' => 'https://picsum.photos/640/480',
            'id_utilisateur' => \App\Models\User::factory(),
            'id_evenement' => \App\Models\Evenement::factory(),
        ];
    }
}
