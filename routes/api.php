<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FavoriController;

// Routes pour les favoris
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/favoris', [FavoriController::class, 'index']);
    Route::post('/favoris', [FavoriController::class, 'store']);
    Route::delete('/favoris/{id_evenement}', [FavoriController::class, 'destroy']);
    Route::get('/favoris/check/{id_evenement}', [FavoriController::class, 'check']);
});

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/dashboard-stats', [DashboardController::class, 'getStats']); 