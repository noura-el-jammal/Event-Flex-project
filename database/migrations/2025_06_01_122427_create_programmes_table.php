<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('programmes', function (Blueprint $table) {
            $table->id('id_Programme');
            $table->string('titre_activite');
            $table->text('description')->nullable();
            $table->string('heure_debut');
            $table->string('heure_fin');
            $table->boolean('editable_manuellement');
            $table->unsignedBigInteger('id_evenement'); // FK evenement
            // Clé étrangère vers evenements
            $table->foreign('id_evenement')
                  ->references('id_evenement')
                  ->on('evenements')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programmes');
    }
};
