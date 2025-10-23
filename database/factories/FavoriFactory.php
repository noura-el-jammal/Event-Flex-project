<?php

namespace Database\Factories;

use App\Models\Favori;
use Illuminate\Database\Eloquent\Factories\Factory;

class FavoriFactory extends Factory
{
    protected $model = Favori::class;

    public function definition(): array
    {
        return [
            'id_utilisateur' => \App\Models\User::factory(),
            'id_Programme' => \App\Models\Programme::factory(),
        ];
    }
}
