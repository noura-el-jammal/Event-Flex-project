<?php

namespace App\Http\Controllers;

use App\Models\Ressource;
use App\Models\Programme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class RessourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'programme_id' => 'required|exists:programmes,id_Programme'
        ]);

        // Vérifier si l'utilisateur est l'organisateur du programme
        $programme = Programme::findOrFail($request->programme_id);
        if ($programme->evenement->id_organisateur !== Auth::id()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $file = $request->file('file');
        $path = $file->store('ressources', 'public');

        $ressource = Ressource::create([
            'url_fichier' => $path,
            'id_Programme' => $request->programme_id
        ]);

        return response()->json([
            'success' => true,
            'ressource' => $ressource
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ressource $ressource)
    {
        // Vérifier si le fichier existe
        if (!Storage::disk('public')->exists($ressource->url_fichier)) {
            abort(404, 'Fichier non trouvé');
        }

        // Retourner le fichier
        return Storage::disk('public')->download($ressource->url_fichier);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ressource $ressource)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ressource $ressource)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ressource $ressource)
    {
        // Vérifier si l'utilisateur est l'organisateur du programme
        if ($ressource->programme->evenement->id_organisateur !== Auth::id()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        // Supprimer le fichier du stockage
        Storage::disk('public')->delete($ressource->url_fichier);
        
        // Supprimer l'enregistrement de la base de données
        $ressource->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ressource supprimée avec succès'
        ]);
    }
}
