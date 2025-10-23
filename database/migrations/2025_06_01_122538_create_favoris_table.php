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
        Schema::create('favoris', function (Blueprint $table) {
            $table->unsignedBigInteger('id_utilisateur');
            $table->foreign('id_utilisateur')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('id_evenement');
            $table->foreign('id_evenement')->references('id_evenement')->on('evenements')->onDelete('cascade');
            $table->primary(['id_utilisateur', 'id_evenement']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favoris');
    }
};
