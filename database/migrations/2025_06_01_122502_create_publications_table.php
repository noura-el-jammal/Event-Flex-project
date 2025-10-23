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
        Schema::create('publications', function (Blueprint $table) {
            $table->id('id_publication');
            $table->text('contenuP');
            $table->date('date_publication');
            $table->string('image_url');
            $table->unsignedBigInteger('id_utilisateur'); // FK utilisateur
            // Clé étrangère vers utilisateurs
            $table->foreign('id_utilisateur')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
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
        Schema::dropIfExists('publications');
    }
};
