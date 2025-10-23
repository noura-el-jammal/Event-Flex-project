<?php

use App\Http\Controllers\EvenementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgrammeController;
use App\Http\Controllers\RessourceController;
use App\Http\Controllers\FavoriController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\CommentaireController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Routes pour les événements
   
    // Routes pour les organisateurs
    Route::middleware('role:organisateur')->group(function () {
        
        Route::get('/evenements/create', [EvenementController::class, 'create'])->name('evenements.create');
        Route::post('/evenements', [EvenementController::class, 'store'])->name('evenements.store');
       
        Route::get('/evenements/{id}/edit', [EvenementController::class, 'edit'])->name('evenements.edit');
        Route::put('/evenements/{id}', [EvenementController::class, 'update'])->name('evenements.update');
        Route::delete('/evenements/{evenement}', [EvenementController::class, 'destroy'])->name('evenements.destroy');
        
        // Routes pour les participants
        Route::get('/evenements/{evenement}/participants', [App\Http\Controllers\ParticipantController::class, 'index'])->name('evenements.participants.index');
        Route::get('/evenements/{evenement}/participants/create', [App\Http\Controllers\ParticipantController::class, 'create'])->name('evenements.participants.create');
        Route::post('/evenements/{evenement}/participants', [App\Http\Controllers\ParticipantController::class, 'store'])->name('evenements.participants.store');
        Route::put('/evenements/{evenement}/participants/{user}', [App\Http\Controllers\ParticipantController::class, 'update'])->name('evenements.participants.update');
        Route::delete('/evenements/{evenement}/participants/{user}', [App\Http\Controllers\ParticipantController::class, 'destroy'])->name('evenements.participants.destroy');

        // Routes pour les programmes
        Route::get('/evenements/{id_evenement}/programmes/create', [ProgrammeController::class, 'create'])->name('programmes.create');
        Route::post('/evenements/{id_evenement}/programmes', [ProgrammeController::class, 'store'])->name('programmes.store');
        Route::put('/programmes/{id}', [ProgrammeController::class, 'update'])->name('programmes.update');
        Route::delete('/programmes/{programme}', [ProgrammeController::class, 'destroy'])->name('programmes.destroy');

        // Routes pour les ressources
        Route::post('/ressources', [RessourceController::class, 'store'])->name('ressources.store');
        Route::delete('/ressources/{ressource}', [RessourceController::class, 'destroy'])->name('ressources.destroy');
    });
    Route::get('/evenements/{evenement}/chat/{user}', [MessageController::class, 'showEventChat'])->name('evenements.chat.show');
    // Routes publiques pour les ressources
     Route::get('/evenements/{id_evenement}', [EvenementController::class, 'show'])->name('evenements.show');
    Route::get('/ressources/{ressource}', [RessourceController::class, 'show'])->name('ressources.show');

    // Routes pour les favoris
    Route::get('/favoris', [FavoriController::class, 'index'])->name('favoris.index');
    Route::post('/favoris', [FavoriController::class, 'store'])->name('favoris.store');
    Route::delete('/favoris/{id_evenement}', [FavoriController::class, 'destroy'])->name('favoris.destroy');
    Route::get('/favoris/check/{id_evenement}', [FavoriController::class, 'check'])->name('favoris.check');

    // Routes pour les évaluations
    Route::post('/evenements/{id_evenement}/evaluations', [EvaluationController::class, 'store'])->name('evaluations.store');

    // Routes pour les publications
    Route::get('/evenements/{id_evenement}/publications', [PublicationController::class, 'index'])->name('publications.index');
    Route::post('/evenements/{id_evenement}/publications', [PublicationController::class, 'store'])->name('publications.store');
    Route::put('/publications/{id}', [PublicationController::class, 'update'])->name('publications.update');
    Route::delete('/publications/{id}', [PublicationController::class, 'destroy'])->name('publications.destroy');

    // Routes pour les commentaires
    Route::post('/commentaires/{id_publication}', [CommentaireController::class, 'store'])->name('commentaires.store');
    Route::delete('/commentaires/{id}', [CommentaireController::class, 'destroy'])->name('commentaires.destroy');

    // Routes pour le chat
    Route::middleware(['auth'])->group(function () {
        // Route pour afficher toutes les conversations
        Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
        
        // Route pour afficher le chat avec un utilisateur spécifique
        Route::get('/chat/{user}', [MessageController::class, 'show'])->name('chat.show');
        
        // Route pour envoyer un message
        Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
        
        // Route pour récupérer les messages
        Route::get('/chat/{user}/messages', [MessageController::class, 'getMessages'])->name('chat.messages.get');
        
        // Route pour démarrer une conversation depuis la page d'événement
        Route::get('/evenements/{evenement}/start-conversation', [MessageController::class, 'startConversationWithOrganizer'])
            ->name('chat.start-conversation')
            ->where('evenement', '[0-9]+');
    });

    // Routes pour les conversations
    Route::get('/conversations', [MessageController::class, 'conversations'])->name('conversations.index');
    Route::get('/conversations/{user}', [MessageController::class, 'getMessagesWithUser'])->name('conversations.show');
});

Route::get('/evenements', [EvenementController::class, 'index'])->name('evenements.index');
require __DIR__.'/auth.php';
