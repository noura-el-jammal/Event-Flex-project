<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
      use HasFactory;
    protected $primaryKey = 'id_notification';

    protected $fillable = ['contenu', 'type', 'date_envoi', 'id_utilisateur'];

    public function utilisateur()
{ 
    return $this->belongsTo(User::class, 'id_utilisateur'); 
}
}
