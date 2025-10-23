<?php

namespace App\Console\Commands;

use App\Models\Evenement;
use App\Mail\EventReminderMail;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class SendEventReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'events:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envoie des rappels pour les événements qui commencent dans 24h';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tomorrow = Carbon::tomorrow();
        $events = Evenement::whereDate('date_debut', $tomorrow)
            ->with('participants')
            ->get();

        foreach ($events as $event) {
            if ($event->participants->isNotEmpty()) {
                foreach ($event->participants as $participant) {
                    Mail::to($participant->email)->send(new EventReminderMail($event));
                    $this->info("Rappel envoyé à {$participant->email} pour l'événement : {$event->titre}");
                }
            }
        }

        $this->info('Tous les rappels ont été envoyés avec succès.');
    }
}
