<?php

namespace App\Http\Controllers;

use App\Models\Evenement;
use App\Models\User;
use App\Models\Evaluation;
use App\Models\Publication;
use App\Models\Commantaire;
use App\Models\Programme;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $welcomeData = [];
        $activityFeed = [];

        if ($user) {
            // Récupérer les publications récentes
            $recentPublications = Publication::latest()->limit(5)->with('user')->get()->map(function($pub) use ($user) {
                return [
                    'type' => 'publication',
                    'id' => $pub->id,
                    'event_name' => $pub->evenement ? $pub->evenement->titre : 'événement inconnu',
                    'message' => $pub->contenu,
                    'user_name' => $pub->user->name,
                    'created_at' => $pub->created_at,
                ];
            });

            // Récupérer les commentaires récents
            $recentComments = Commantaire::latest()->limit(5)->with('user', 'publication.evenement')->get()->map(function($comment) use ($user) {
                return [
                    'type' => 'commentaire',
                    'id' => $comment->id,
                    'event_name' => $comment->publication && $comment->publication->evenement ? $comment->publication->evenement->titre : 'événement inconnu',
                    'message' => $comment->contenu,
                    'user_name' => $comment->user->name,
                    'created_at' => $comment->created_at,
                ];
            });

            // Récupérer les sessions populaires ou récentes
            $recentPrograms = Programme::with(['evenement' => function($query) {
                $query->select('id_evenement', 'titre');
            }])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function($program) use ($user) {
                $heureDebut = Carbon::parse($program->heure_debut)->format('H:i');
                $heureFin = Carbon::parse($program->heure_fin)->format('H:i');
                
                // Vérifier si l'événement existe et a un nom
                $eventName = $program->evenement && $program->evenement->titre 
                    ? $program->evenement->titre 
                    : 'un événement';
                
                return [
                    'type' => 'session',
                    'id' => $program->id_Programme,
                    'event_name' => $eventName,
                    'message' => sprintf(
                        'Nouvelle programme "%s"  dans l\'événement "%s" de %s à %s',
                        $program->titre_activite,
                        $eventName,
                        $heureDebut,
                        $heureFin
                    ),
                    'created_at' => $program->created_at,
                ];
            });

            // Initialiser la collection d'activités
            $activityFeedCollection = collect();
            $activityFeedCollection = $activityFeedCollection->merge($recentPublications);
            $activityFeedCollection = $activityFeedCollection->merge($recentComments);
            $activityFeedCollection = $activityFeedCollection->merge($recentPrograms);

            // Récupérer les messages de l'organisateur (si l'utilisateur est participant)
            if ($user->role === 'participants') {
                $organizerMessages = Message::where('id_destinataire', $user->id)
                    ->whereHas('user', function($query) {
                        $query->where('role', 'organisateur');
                    })
                    ->latest('date_envoi')
                    ->limit(5)
                    ->with('user', 'evenement')
                    ->get()
                    ->map(function($message) use ($user) {
                        return [
                            'type' => 'message_organisateur',
                            'id' => $message->id_message,
                            'user_name' => $message->user->name,
                            'message' => 'Message de ' . $message->user->name . ': "' . $message->contenu . '" ',
                            'created_at' => $message->created_at,
                        ];
                    });
                $activityFeedCollection = $activityFeedCollection->merge($organizerMessages);
            }

            // Trier le flux d'activités par date et prendre les 10 premiers
            $activityFeed = $activityFeedCollection->sortByDesc('created_at')->take(10)->values()->all();

            // Logique spécifique à chaque rôle pour le message d'accueil principal
            switch ($user->role) {
                case 'organisateur':
                    $upcomingEvents = Evenement::where('id_organisateur', $user->id)
                        ->where('date_debut', '>=', Carbon::today())
                        ->orderBy('date_debut')
                        ->limit(5)
                        ->get();
                    $welcomeData = ['upcomingEvents' => $upcomingEvents];
                    break;

                case 'participants':
                    $favoriteEvents = Evenement::whereHas('favoris', function ($query) use ($user) {
                        $query->where('id_utilisateur', $user->id);
                    })
                    ->with(['organisateur', 'programmes'])
                    ->get()
                    ->map(function($event) {
                        return [
                            'id' => $event->id_evenement,
                            'nom' => $event->nom,
                            'date_debut' => $event->date_debut,
                            'date_fin' => $event->date_fin,
                            'lieu' => $event->lieu,
                            'organisateur' => $event->organisateur->name,
                            'programmes_count' => $event->programmes->count(),
                        ];
                    });
                    $welcomeData = ['favoriteEvents' => $favoriteEvents];
                    break;

                case 'intervenant':
                    $welcomeData = ['message' => 'Voici vos prochaines interventions.'];
                    break;

                default:
                    $welcomeData = ['message' => 'Bienvenue sur votre espace personnel.'];
                    break;
            }
        }

        return Inertia::render('Dashboard', [
            'user' => $user ? $user->only('id', 'name', 'email', 'role') : null,
            'welcomeData' => $welcomeData,
            'activityFeed' => array_slice($activityFeed, 0, 10),
        ]);
    }
}
