<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\User;
use App\Models\Evenement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ParticipantController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Récupérer les participants de tous les événements créés par l'organisateur actuel
        $user = Auth::user();

        if ($user->role !== 'organisateur') {
            return redirect()->route('dashboard')->with('error', 'Vous n\'avez pas la permission d\'accéder à cette ressource.');
        }

        $evenementsOrganises = $user->evenementsCrees()->with('participants.user')->get();

        $participantsParEvenement = $evenementsOrganises->mapWithKeys(function ($evenement) {
            return [$evenement->id_evenement => $evenement->participants->map(function ($participant) {
                return [
                    'id_utilisateur' => $participant->id_utilisateur,
                    'nom_utilisateur' => $participant->user->name,
                    'role_dans_evenement' => $participant->rôle_dans_evenement,
                ];
            })];
        });

        return Inertia::render('Participants/Index', [
            'evenementsOrganises' => $evenementsOrganises->map(fn ($evenement) => [
                'id_evenement' => $evenement->id_evenement,
                'titre' => $evenement->titre,
            ]),
            'participantsParEvenement' => $participantsParEvenement,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Evenement $evenement)
    {
        // Permet à l'organisateur de chercher des utilisateurs à inviter
        // et de leur assigner un rôle pour cet événement.
        $this->authorize('inviteParticipants', $evenement);

        $users = User::all()->map(fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);

        return Inertia::render('Participants/Create', [
            'evenement' => [
                'id_evenement' => $evenement->id_evenement,
                'titre' => $evenement->titre,
            ],
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_evenement' => 'required|exists:evenements,id_evenement',
            'id_utilisateur' => 'required|exists:users,id',
            'rôle_dans_evenement' => ['required', 'in:Participant,Intervenant'],
        ]);

        $evenement = Evenement::find($request->id_evenement);
        $this->authorize('inviteParticipants', $evenement);

        // Vérifier si le participant existe déjà pour cet événement
        $existingParticipant = Participant::where('id_utilisateur', $request->id_utilisateur)
                                        ->where('id_evenement', $request->id_evenement)
                                        ->first();

        if ($existingParticipant) {
            return back()->with('error', 'Cet utilisateur est déjà un participant de cet événement.');
        }

        Participant::create([
            'id_utilisateur' => $request->id_utilisateur,
            'id_evenement' => $request->id_evenement,
            'rôle_dans_evenement' => $request->rôle_dans_evenement,
        ]);

        return back()->with('success', 'Participant ajouté avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Participant $participant)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Participant $participant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Evenement $evenement, User $user)
    {
        $this->authorize('updateParticipantRole', $evenement);

        $request->validate([
            'rôle_dans_evenement' => ['required', 'in:Participant,Intervenant'],
        ]);

        $participant = Participant::where('id_utilisateur', $user->id)
                                  ->where('id_evenement', $evenement->id_evenement)
                                  ->firstOrFail();

        $participant->rôle_dans_evenement = $request->rôle_dans_evenement;
        $participant->save();

        return back()->with('success', 'Rôle du participant mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Evenement $evenement, User $user)
    {
        $this->authorize('removeParticipant', $evenement);

        $participant = Participant::where('id_utilisateur', $user->id)
                                  ->where('id_evenement', $evenement->id_evenement)
                                  ->firstOrFail();

        $participant->delete();

        return back()->with('success', 'Participant supprimé avec succès de l\'événement.');
    }
}
