<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use App\Models\User;
use App\Models\Evenement;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Participant extends Pivot
{
      use HasFactory;
    protected $table = 'participants';
    public $timestamps = false;

    protected $fillable = [
        'id_utilisateur',
        'id_evenement',
        'rôle_dans_evenement',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(User::class, 'id_utilisateur');
    }

    public function evenement()
    {
        return $this->belongsTo(Evenement::class, 'id_evenement');
    }
}
