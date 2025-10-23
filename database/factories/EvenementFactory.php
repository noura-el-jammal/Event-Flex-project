<?php

namespace Database\Factories;

use App\Models\Evenement;
use Illuminate\Database\Eloquent\Factories\Factory;

class EvenementFactory extends Factory
{
    protected $model = Evenement::class;

    public function definition(): array
    {
        // Create an organizer if none exists
        $organizer = \App\Models\User::where('role', 'organisateur')->first();
        if (!$organizer) {
            $organizer = \App\Models\User::factory()->create([
                'role' => 'organisateur'
            ]);
        }

        return [
            'titre' => $this->faker->sentence(3),
            'date_debut' => $this->faker->dateTimeBetween('+1 week', '+1 year'),
            'lieu' => $this->faker->city(),
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
            'durée' => $this->faker->numberBetween(60, 360),
            'id_organisateur' => $organizer->id,
        ];
    }
}
