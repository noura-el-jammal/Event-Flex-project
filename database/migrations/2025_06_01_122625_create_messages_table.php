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
        Schema::create('messages', function (Blueprint $table) {
            $table->id('id_message');
            $table->string('contenu');
            $table->date('date_envoi');
            $table->unsignedBigInteger('id_utilisateur');
            $table->unsignedBigInteger('id_destinataire');
            $table->foreign('id_utilisateur')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
            $table->foreign('id_destinataire')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
            $table->unsignedBigInteger('id_evenement')->nullable(); // FK evenement optionnelle
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
        Schema::dropIfExists('messages');
    }
};
