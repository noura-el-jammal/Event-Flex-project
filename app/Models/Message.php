<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
      use HasFactory;

    protected $table = 'messages';
    protected $primaryKey = 'id_message';

    protected $fillable = [
        'contenu',
        'date_envoi',
        'id_utilisateur',
        'id_destinataire',
        'id_evenement'
    ];

    protected $casts = [
        'date_envoi' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_utilisateur');
    }

    public function destinataire() 
    { 
        return $this->belongsTo(User::class, 'id_destinataire');
    }

    public function evenement()
    {
        return $this->belongsTo(Evenement::class, 'id_evenement');
    }
}
