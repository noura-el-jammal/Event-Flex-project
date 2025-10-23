<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use App\Models\Evenement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PublicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id_evenement)
    {
        try {
            $evenement = null;
            $isOrganisateur = false;
            $publicationsQuery = Publication::with(['user', 'commentaires.user']);
            $organisateurEvents = []; // Initialize as empty array

            if (Auth::check() && Auth::user()->role === 'organisateur') {
                $isOrganisateur = true;
                // Fetch events owned by the current organizer
                $organisateurEvents = Evenement::where('id_organisateur', Auth::id())
                                    ->select('id_evenement', 'titre')
                                    ->get();
            }

            // If 'all' is passed as id_evenement, fetch all publications
            if ($id_evenement === 'all') {
                // No filtering by id_evenement, $evenement remains null
            } else {
                // Otherwise, fetch publications for the specific event
            $evenement = Evenement::with(['organisateur'])->findOrFail($id_evenement);
                // isOrganisateur check is already handled above based on Auth::user()->role, 
                // but we might need to refine it if the user is a participant of this specific event
                // For now, it handles general organizer role.
                $publicationsQuery->where('id_evenement', $id_evenement);
            }

            $publications = $publicationsQuery->latest('date_publication')->paginate(10);

            return Inertia::render('Evenement/Publications', [
                'evenement' => $evenement, // Will be null if 'all' was requested
                'publications' => $publications,
                'auth' => [
                    'user' => Auth::user()
                ],
                'isOrganisateur' => $isOrganisateur,
                'organisateurEvents' => $organisateurEvents // Pass organizer's events
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Une erreur est survenue lors du chargement des publications: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $id_evenement)
    {
        $user = Auth::user();

        // Vérifier si l'utilisateur est un organisateur ou un participant
        if (!$user || ($user->role !== 'organisateur' && $user->role !== 'participants')) {
            return back()->with('error', 'Vous n\'êtes pas autorisé à créer une publication.');
        }

        $request->validate([
            'contenuP' => 'required|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        try {
            $publication = new Publication();
            $publication->contenuP = $request->contenuP;
            $publication->date_publication = now();
            $publication->id_utilisateur = Auth::id();
            $publication->id_evenement = $id_evenement;

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('storage/publications'), $filename);
                $publication->image_url = '/storage/publications/' . $filename;
            }

            $publication->save();

            return back()->with('success', 'Publication créée avec succès');
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la création de la publication: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Publication $publication)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Publication $publication)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $publication = Publication::findOrFail($id);

        if ($publication->id_utilisateur !== Auth::id()) {
            return back()->with('error', 'Vous n\'êtes pas autorisé à modifier cette publication');
        }

        $request->validate([
            'contenuP' => 'required|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        try {
            $publication->contenuP = $request->contenuP;
            $publication->date_publication = now();

            if ($request->hasFile('image')) {
                // Supprimer l'ancienne image si elle existe
                if ($publication->image_url) {
                    $oldImagePath = public_path(ltrim($publication->image_url, '/'));
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }

                // Sauvegarder la nouvelle image
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('storage/publications'), $filename);
                $publication->image_url = '/storage/publications/' . $filename;
            }

            $publication->save();

            return back()->with('success', 'Publication mise à jour avec succès');
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la mise à jour de la publication: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $publication = Publication::findOrFail($id);

        if ($publication->id_utilisateur !== Auth::id()) {
            return redirect()->back()->with('error', 'Vous n\'êtes pas autorisé à supprimer cette publication');
        }

        try {
            if ($publication->image_url) {
                $imagePath = public_path(ltrim($publication->image_url, '/'));
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $publication->delete();

            return redirect()->back()->with('success', 'Publication supprimée avec succès');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erreur lors de la suppression de la publication: ' . $e->getMessage());
        }
    }
}
