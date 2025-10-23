<?php

namespace App\Http\Controllers;

use App\Models\Commantaire;
use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentaireController extends Controller
{
    /**
     * Enregistre un nouveau commentaire pour une publication donnée.
     */
    public function store(Request $request, $id_publication)
    {
        $request->validate([
            'contenu' => 'required|string|max:1000'
        ]);

        $publication = Publication::findOrFail($id_publication);

        $commentaire = new Commantaire();
        $commentaire->contenu = $request->contenu;
        $commentaire->date_envoi = now();
        $commentaire->id_publication = $id_publication;
        $commentaire->id_utilisateur = Auth::id();
        $commentaire->save();

        return back()->with('success', 'Commentaire ajouté avec succès');
    }

    /**
     * (Optionnel) Supprimer un commentaire
     */
    public function destroy($id)
    {
        $commentaire = Commantaire::findOrFail($id);

        if ($commentaire->id_utilisateur !== Auth::id()) {
            return back()->with('error', 'Vous n\'êtes pas autorisé à supprimer ce commentaire');
        }

        $commentaire->delete();

        return back()->with('success', 'Commentaire supprimé avec succès');
    }
}
