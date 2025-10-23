<?php

namespace App\Http\Controllers;

use App\Models\Evenement;
use App\Models\Programme;
use App\Models\Ressource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProgrammeController extends Controller
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
    public function create($id_evenement)
    {
        $evenement = Evenement::findOrFail($id_evenement);

        return inertia('Programmes/Create', [
            'evenement' => $evenement,
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    public function store(Request $request, $id_evenement)
    {
        try {
            // Vérifier si l'événement existe
            $evenement = Evenement::findOrFail($id_evenement);

            // Validation des données
            $request->validate([
                'programmes' => 'required|array',
                'programmes.*.titre_activite' => 'required|string|max:255',
                'programmes.*.heure_debut' => 'required|date_format:H:i',
                'programmes.*.heure_fin' => 'required|date_format:H:i|after:programmes.*.heure_debut',
                'programmes.*.ressources' => 'nullable|array',
                'programmes.*.ressources.*' => 'file|max:10240' // 10MB max
            ]);

            DB::beginTransaction();

            $programmesCrees = [];

            foreach ($request->programmes as $programmeData) {
                $programme = Programme::create([
                    'titre_activite' => $programmeData['titre_activite'],
                    'heure_debut' => $programmeData['heure_debut'],
                    'heure_fin' => $programmeData['heure_fin'],
                    'editable_manuellement' => true,
                    'id_evenement' => $id_evenement,
                ]);

                $programmesCrees[] = $programme;

                // Gestion des ressources si présentes
                if (isset($programmeData['ressources']) && is_array($programmeData['ressources'])) {
                    foreach ($programmeData['ressources'] as $file) {
                        $path = $file->store('ressources', 'public');
                        Ressource::create([
                            'url_fichier' => $path,
                            'id_Programme' => $programme->id_Programme
                        ]);
                    }
                }
            }

            DB::commit();

            return redirect()->route('evenements.show', $id_evenement)
                ->with('success', 'Programmes ajoutés avec succès.');

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return back()->with('error', 'Événement non trouvé.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur lors de la création des programmes: ' . $e->getMessage());
            return back()->with('error', 'Une erreur est survenue lors de l\'enregistrement: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Programme $programme)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    // public function edit(Programme $programme)
    // {
    //     //
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            Log::info('Tentative de mise à jour du programme', [
                'id' => $id,
                'data' => $request->all()
            ]);

            $programme = Programme::where('id_Programme', $id)->firstOrFail();

            $validated = $request->validate([
                'titre_activite' => 'required|string|max:255',
                'heure_debut' => 'required|date_format:H:i',
                'heure_fin' => 'required|date_format:H:i|after:heure_debut'
            ]);

            Log::info('Données validées', ['data' => $validated]);

            $programme->update($validated);

            Log::info('Programme mis à jour avec succès', [
                'id' => $programme->id_Programme,
                'programme' => $programme->toArray()
            ]);

            return back()->with([
                'programme' => $programme
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Programme non trouvé', ['id' => $id]);
            return back()->with('error', 'Programme non trouvé');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Erreur de validation', ['errors' => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du programme', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Une erreur est survenue lors de la mise à jour du programme: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $programme = Programme::where('id_Programme', $id)->firstOrFail();

            // Supprimer les ressources associées
            foreach ($programme->ressources as $ressource) {
                Storage::disk('public')->delete($ressource->url_fichier);
                $ressource->delete();
            }

            $programme->delete();
            return back()->with('success', 'Programme supprimé avec succès');
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du programme', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return back()->with('error', 'Une erreur est survenue lors de la suppression du programme: ' . $e->getMessage());
        }
    }
}
