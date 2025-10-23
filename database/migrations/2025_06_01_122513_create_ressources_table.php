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
        Schema::create('ressources', function (Blueprint $table) {
            $table->id('id_Ressource');
            $table->string('url_fichier');
            $table->unsignedBigInteger('id_Programme'); // FK programme
            // Clé étrangère vers programmes
            $table->foreign('id_Programme')
                  ->references('id_Programme')
                  ->on('programmes')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ressources');
    }
};
