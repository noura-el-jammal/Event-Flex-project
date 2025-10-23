<?php

namespace App\Http\Controllers;

use App\Models\Favori;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class FavoriController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $favoris = Favori::with('evenement')
            ->where('id_utilisateur', Auth::id())
            ->get();

        return Inertia::render('Evenement/Favoris', [
            'favoris' => $favoris
        ]);
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
            'id_evenement' => 'required|exists:evenements,id_evenement'
        ]);

        // Vérifier si l'événement est déjà en favori
        $existingFavori = Favori::where('id_utilisateur', Auth::id())
            ->where('id_evenement', $request->id_evenement)
            ->first();

        if ($existingFavori) {
            return back()->with('error', 'Cet événement est déjà dans vos favoris');
        }

        Favori::create([
            'id_utilisateur' => Auth::id(),
            'id_evenement' => $request->id_evenement
        ]);

        return back()->with('success', 'Événement ajouté aux favoris avec succès');
    }

    /**
     * Display the specified resource.
     */
    public function show(Favori $favori)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Favori $favori)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Favori $favori)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id_evenement)
    {
        $favori = Favori::where('id_utilisateur', Auth::id())
            ->where('id_evenement', $id_evenement)
            ->first();

        if (!$favori) {
            return back()->with('error', 'Favori non trouvé');
        }

        $favori->delete();

        return back()->with('success', 'Événement retiré des favoris avec succès');
    }

    /**
     * Vérifier si un événement est dans les favoris
     */
    public function check($id_evenement)
    {
        $isFavori = Favori::where('id_utilisateur', Auth::id())
            ->where('id_evenement', $id_evenement)
            ->exists();

        return response()->json([
            'isFavori' => $isFavori
        ]);
    }
}
