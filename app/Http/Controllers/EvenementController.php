<?php

namespace App\Http\Controllers;

use App\Models\Evenement;
use Illuminate\Http\Request;
use App\Models\Programme;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class EvenementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $evenements = Evenement::with('organisateur');

        // Apply search filters
        if ($request->has('searchTerm') && $request->searchTerm !== null) {
            $searchTerm = $request->searchTerm;
            $evenements->where(function($query) use ($searchTerm) {
                $query->where('titre', 'like', '%' . $searchTerm . '%');
            });
        }

        if ($request->has('location') && $request->location !== null) {
            $location = $request->location;
            $evenements->where('lieu', 'like', '%' . $location . '%');
        }

        if ($user && $user->role==='organisateur') {
            // Pour les organisateurs connectés : afficher uniquement leurs événements après filtrage
            $evenements->where('id_organisateur', $user->id);
        }
        // Si l'utilisateur n'est pas organisateur (connecté ou non), afficher tous les événements (les filtres s'appliquent)

        $evenements = $evenements->latest()->get();

        // Préparer les données d'évaluation
        $userRatings = [];
        $averageRatings = [];
        $favoris = [];
        
        // Récupérer les favoris de l'utilisateur
        if ($user) {
            $favoris = DB::table('favoris')
                ->where('id_utilisateur', $user->id)
                ->pluck('id_evenement')
                ->toArray();
        }
        
        foreach ($evenements as $evenement) {
            // Calculer la note moyenne
            $averageRating = DB::table('evaluations')
                ->where('id_evenement', $evenement->id_evenement)
                ->avg('note');
            $averageRatings[$evenement->id_evenement] = $averageRating ?? 0;

            // Si l'utilisateur est connecté, récupérer sa note
            if ($user) {
                $userRating = DB::table('evaluations')
                    ->where('id_evenement', $evenement->id_evenement)
                    ->where('id_utilisateur', $user->id)
                    ->value('note');
                if ($userRating) {
                    $userRatings[$evenement->id_evenement] = $userRating;
                }
            }
        }

        return Inertia::render('Evenement/Index', [
            'evenements' => $evenements,
            'auth' => [
                'user' => $user
            ],
            'filters' => $request->only(['searchTerm', 'location']),
            'initialUserRatings' => $userRatings,
            'initialAverageRatings' => $averageRatings,
            'favoris' => $favoris
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Vérifier si l'utilisateur est connecté et organisateur
        if (!Auth::check() || Auth::user()->role !== 'organisateur') {
            return redirect()->route('evenements.index')
                ->with('error', 'Seuls les organisateurs peuvent créer des événements.');
        }

        return Inertia::render('Evenement/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Vérifier si l'utilisateur est connecté et organisateur
        if (!Auth::check() || Auth::user()->role !== 'organisateur') {
            return redirect()->route('evenements.index')
                ->with('error', 'Seuls les organisateurs peuvent créer des événements.');
        }

        // Validation des données
        $validated = $request->validate([
            'titre' => 'required|string|max:100',
            'date_debut' => 'required|date',
            'lieu' => 'required|string|max:2550',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'duree' => 'required|integer|min:1',
        ]);

        // if ($request->hasFile('image')) {
        //     $path = $request->file('image')->store('images/evenements', 'public');
        //     $validated['image'] = $path;
        // }

        $evenement = Evenement::create([
            'titre' => $validated['titre'],
            'date_debut' => $validated['date_debut'],
            'lieu' => $validated['lieu'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'duree' => $validated['duree'],
            // 'image' => $validated['image'] ?? null,
            'id_organisateur' => Auth::id(),
        ]);

        return redirect()->route('evenements.show', $evenement->id_evenement)
                     ->with('success', 'Événement créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id_evenement)
    {
        // La consultation est ouverte à tous, pas besoin de vérifier le rôle ici.
        $evenement = Evenement::with(['organisateur', 'programmes' => function($query) {
            $query->orderBy('heure_debut', 'asc');
        }, 'programmes.ressources'])->findOrFail($id_evenement);

        return inertia('Evenement/Detail', [
            'evenement' => $evenement,
            'programmes' => $evenement->programmes,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $evenement = Evenement::findOrFail($id);
        
        // Vérifier si l'utilisateur est connecté et est l'organisateur de l'événement
        if (!Auth::check() || $evenement->id_organisateur !== Auth::id()) {
            return redirect()->route('evenements.index')
                ->with('error', 'Vous n\'êtes pas autorisé à modifier cet événement.');
        }

        return Inertia::render('Evenement/edit', [
            'evenement' => $evenement,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $evenement = Evenement::findOrFail($id);
        
        // Vérifier si l'utilisateur est connecté et est l'organisateur de l'événement
        if (!Auth::check() || $evenement->id_organisateur !== Auth::id()) {
            return redirect()->route('evenements.index')
                ->with('error', 'Vous n\'êtes pas autorisé à modifier cet événement.');
        }

        $validated = $request->validate([
            'titre' => 'required|string|max:100',
            'date_debut' => 'required|date',
            'lieu' => 'required|string|max:2550',
            'duree' => 'required|integer|min:1',
        ]);

        $evenement->update([
            'titre' => $validated['titre'],
            'date_debut' => $validated['date_debut'],
            'lieu' => $validated['lieu'],
            'duree' => $validated['duree'],
        ]);

        return redirect()->route('evenements.show', $id)
            ->with('success', 'Événement mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $evenement = Evenement::findOrFail($id);
        
        // Vérifier si l'utilisateur est connecté et est l'organisateur de l'événement
        if (!Auth::check() || $evenement->id_organisateur !== Auth::id()) {
            return redirect()->route('evenements.index')
                ->with('error', 'Vous n\'êtes pas autorisé à supprimer cet événement.');
        }

        $evenement->delete();

        return redirect()->route('evenements.index')
            ->with('success', 'Événement supprimé avec succès.');
    }
}
