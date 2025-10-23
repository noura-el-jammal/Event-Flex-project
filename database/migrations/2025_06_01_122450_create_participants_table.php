<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParticipantsTable extends Migration
{
    public function up()
    {
        Schema::create('participants', function (Blueprint $table) {
            $table->unsignedBigInteger('id_utilisateur');
            $table->unsignedBigInteger('id_evenement');
            $table->enum('rôle_dans_evenement', ['Participant', 'Intervenant']);
            
            $table->primary(['id_utilisateur', 'id_evenement']);
            
            $table->foreign('id_utilisateur')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('id_evenement')->references('id_evenement')->on('evenements')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('participants');
    }
}
