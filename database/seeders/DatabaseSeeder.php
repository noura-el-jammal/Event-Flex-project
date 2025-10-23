<?php

namespace Database\Seeders;

use App\Models\Evenement;
use App\Models\Message;
use App\Models\Notification;
use App\Models\Publication;
use App\Models\Commantaire;
use App\Models\Evaluation;
use App\Models\Favori;
use App\Models\Participant;
use App\Models\Programme;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create organizer
        $organizer = User::factory()->create([
            'name' => 'Organisateur',
            'email' => 'organisateur@example.com',
            'password' => Hash::make('password'),
            'role' => 'organisateur'
        ]);

        // Create regular users
        $users = User::factory()->count(10)->create([
            'role' => 'participants'
        ]);

        // Create events
        $events = Evenement::factory()->count(5)->create([
            'id_organisateur' => $organizer->id
        ]);

        // Create programmes for each event
        foreach ($events as $event) {
            $programmes = Programme::factory()
                ->count(3)
                ->forEvent($event)
                ->create();

            // Create one comment per user per programme
            foreach ($programmes as $programme) {
                // Select 3 random users to comment on this programme
                $commentingUsers = $users->random(3);
                foreach ($commentingUsers as $user) {
                    Commantaire::factory()->create([
                        'id_Programme' => $programme->id_Programme,
                        'id_utilisateur' => $user->id
                    ]);
                }

                // Create evaluations for this programme
                $evaluatingUsers = $users->random(5);
                foreach ($evaluatingUsers as $user) {
                    Evaluation::factory()->create([
                        'id_Programme' => $programme->id_Programme,
                        'id_utilisateur' => $user->id
                    ]);
                }

                // Create favorites for this programme
                $favoritingUsers = $users->random(4);
                foreach ($favoritingUsers as $user) {
                    Favori::factory()->create([
                        'id_Programme' => $programme->id_Programme,
                        'id_utilisateur' => $user->id
                    ]);
                }
            }

            // Create participants for this event
            $participatingUsers = $users->random(5);
            foreach ($participatingUsers as $user) {
                Participant::factory()
                    ->forEvent($event)
                    ->create([
                        'id_utilisateur' => $user->id
                    ]);
            }
        }

        // Create messages between users
        foreach ($users as $user) {
            Message::factory()->count(3)->create([
                'id_expediteur' => $user->id,
                'id_destinataire' => $users->random()->id
            ]);
        }

        // Create notifications for users
        foreach ($users as $user) {
            Notification::factory()->count(2)->create([
                'id_utilisateur' => $user->id
            ]);
        }

        // Create publications
        foreach ($users as $user) {
            Publication::factory()->create([
                'id_utilisateur' => $user->id
            ]);
        }
    }
}
