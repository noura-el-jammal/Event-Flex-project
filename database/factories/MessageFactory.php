<?php

namespace Database\Factories;

use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Evenement;
class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition(): array
    {
        return [
            'contenu' => $this->faker->sentence(),
            'date_envoi' => $this->faker->dateTimeThisYear(),
            'id_expediteur' => \App\Models\User::factory(),
            'id_destinataire' => \App\Models\User::factory(),
            'id_evenement' => \App\Models\Evenement::factory(),
        ];
    }
}
