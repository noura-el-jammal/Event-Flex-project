<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Evenement extends Model
{
      use HasFactory;
protected $primaryKey = 'id_evenement';

protected $fillable = [
        'titre', 'date_debut', 'lieu', 'latitude', 'longitude', 'duree', 'id_organisateur'
    ];

    public function organisateur() 
{ 
        return $this->belongsTo(User::class, 'id_organisateur'); 
}

    public function participants()
{
    return $this->belongsToMany(User::class, 'participants', 'id_evenement', 'id_utilisateur')
                ->withPivot('rôle_dans_evenement')
                ->using(Participant::class);
}

    public function messages() 
{ 
    return $this->hasMany(Message::class, 'id_evenement'); 
}

    public function programmes() 
{ 
    return $this->hasMany(Programme::class, 'id_evenement'); 
}

    public function publications() 
{ 
    return $this->hasMany(Publication::class, 'id_evenement'); 
}

 public function evaluations() 
    { 
        return $this->belongsToMany(User::class, 'evaluations','id_evenement','id_utilisateur')
                    ->withPivot('note')
                    ->using(evaluation::class);
    }

    public function favoris()
    {
        return $this->belongsToMany(User::class, 'favoris', 'id_evenement', 'id_utilisateur');
    }
}
