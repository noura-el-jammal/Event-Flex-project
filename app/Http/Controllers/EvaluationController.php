<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\Evenement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class EvaluationController extends Controller
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
    public function store(Request $request, $id_evenement)
    {
        try {
            $validated = $request->validate([
                'note' => 'required|integer|min:1|max:5'
            ]);

            $user = Auth::user();

            // Utiliser le Query Builder pour créer ou mettre à jour l'évaluation
            DB::table('evaluations')
                ->updateOrInsert(
                    [
                        'id_utilisateur' => $user->id,
                        'id_evenement' => $id_evenement
                    ],
                    [
                        'note' => $validated['note'],
                        'updated_at' => now()
                    ]
                );

            // Recalculer la moyenne des notes
            $averageRating = DB::table('evaluations')
                ->where('id_evenement', $id_evenement)
                ->avg('note');

            // Récupérer toutes les évaluations pour cet événement
            $evaluations = DB::table('evaluations')
                ->where('id_evenement', $id_evenement)
                ->pluck('note', 'id_utilisateur')
                ->toArray();

            return redirect()->route('evenements.index')->with([
                'flash' => [
                    'success' => true,
                    'averageRating' => (float)$averageRating,
                    'evaluations' => $evaluations,
                    'evenementId' => $id_evenement
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'évaluation: ' . $e->getMessage());
            return redirect()->route('evenements.index')->with([
                'flash' => [
                    'success' => false,
                    'message' => 'Une erreur est survenue lors de l\'évaluation'
                ]
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Evaluation $evaluation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Evaluation $evaluation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Evaluation $evaluation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id_evenement)
    {
        try {
            DB::table('evaluations')
                ->where('id_utilisateur', Auth::id())
                ->where('id_evenement', $id_evenement)
                ->delete();
            
            // Recalculer la moyenne après suppression
            $averageRating = DB::table('evaluations')
                ->where('id_evenement', $id_evenement)
                ->avg('note');

            // Récupérer toutes les évaluations pour cet événement
            $evaluations = DB::table('evaluations')
                ->where('id_evenement', $id_evenement)
                ->pluck('note', 'id_utilisateur')
                ->toArray();

            return back()->with([
                'success' => true,
                'averageRating' => round($averageRating, 1),
                'evaluations' => $evaluations,
                'evenementId' => $id_evenement
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de l\'évaluation: ' . $e->getMessage());
            return back()->with('error', 'Une erreur est survenue lors de la suppression de l\'évaluation');
        }
    }
}
