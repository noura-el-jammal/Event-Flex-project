<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('evenements', function (Blueprint $table) {
            $table->id('id_evenement'); // Clé primaire
            $table->string('titre', 100);
            $table->dateTime('date_debut');
            $table->text('lieu', 2550); // Augmenté à 255 caractères
            $table->decimal('latitude', 10, 8)->nullable();   // coordonnée automatique
            $table->decimal('longitude', 11, 8)->nullable();  // coordonnée automatique
            $table->integer('duree'); // en minutes
            $table->unsignedBigInteger('id_organisateur'); // FK utilisateur

            $table->timestamps();

            // Clé étrangère vers utilisateurs
            $table->foreign('id_organisateur')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evenements');
    }
};
