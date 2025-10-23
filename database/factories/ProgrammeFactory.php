<?php

namespace Database\Factories;

use App\Models\Programme;
use App\Models\Evenement;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProgrammeFactory extends Factory
{
    protected $model = Programme::class;

    public function definition(): array
    {
        $debut = $this->faker->dateTimeBetween('today 08:00', 'today 15:00');
        $fin = (clone $debut)->modify('+1 hour');

        return [
            'titre_activite' => $this->faker->sentence(4),
            'heure_debut' => $debut,
            'heure_fin' => $fin,
            'editable_manuellement' => $this->faker->boolean(),
            'id_evenement' => function () {
                return Evenement::factory()->create()->id_evenement;
            },
        ];
    }

    /**
     * Indicate that the programme belongs to a specific event.
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
