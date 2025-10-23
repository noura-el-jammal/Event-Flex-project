<?php

namespace Database\Factories;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition(): array
    {
        return [
            'contenuN' => $this->faker->sentence(),
            'date_envoiN' => $this->faker->dateTimeThisMonth(),
            'id_utilisateur' => \App\Models\User::factory(),
        ];
    }
}
