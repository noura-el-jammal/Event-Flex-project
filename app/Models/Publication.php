<?php

namespace App\Models;
use App\Models\User;
use App\Models\Evenement;
use App\Models\Commantaire;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
      use HasFactory;
    protected $table = 'publications';
    protected $primaryKey = 'id_publication';

    protected $fillable = [
        'contenuP',
        'date_publication',
        'image_url',
        'id_utilisateur',
        'id_evenement'
    ];

    public function user() {
         return $this->belongsTo(User::class, 'id_utilisateur'); 
}

    public function evenement() {
     return $this->belongsTo(Evenement::class, 'id_evenement');
}

    public function commentaires() { 
        return $this->hasMany(Commantaire::class, 'id_publication'); 
    }
}

