<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('commantaires', function (Blueprint $table) {
            $table->id();
            $table->text('contenu');
            $table->dateTime('date_envoi');
            $table->unsignedBigInteger('id_publication');
            $table->unsignedBigInteger('id_utilisateur');
            $table->timestamps();

            $table->foreign('id_publication')
                  ->references('id_publication')
                  ->on('publications')
                  ->onDelete('cascade');
            
            $table->foreign('id_utilisateur')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('commantaires');
    }
}; 