<?php

namespace Database\Factories;

use App\Models\Participant;
use App\Models\Evenement;
use Illuminate\Database\Eloquent\Factories\Factory;

class ParticipantFactory extends Factory
{
    protected $model = Participant::class;

    public function definition(): array
    {
        return [
            'id_utilisateur' => \App\Models\User::factory(),
            'id_evenement' => function () {
                return Evenement::factory()->create()->id_evenement;
            },
            'rôle_dans_evenement' => $this->faker->randomElement(['Participant', 'Intervenant']),
        ];
    }

    /**
     * Indicate that the participant belongs to a specific event.
     */
    public function forEvent(Evenement $event): static
    {
        return $this->state(function (array $attributes) use ($event) {
            return [
                'id_evenement' => $event->id_evenement,
            ];
        });
    }
}
