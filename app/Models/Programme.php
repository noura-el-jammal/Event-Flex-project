<?php

namespace App\Models;
use App\Models\Evenement;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    use HasFactory;

    protected $table = 'programmes';
    protected $primaryKey = 'id_Programme';

    protected $fillable = [
        'titre_activite',
        'heure_debut',
        'heure_fin',
        'editable_manuellement',
        'id_evenement'
    ];

    protected $casts = [
        'editable_manuellement' => 'boolean',
        'heure_debut' => 'string',
        'heure_fin' => 'string'
    ];

    public function evenement()
    {
        return $this->belongsTo(Evenement::class, 'id_evenement');
    }

    public function ressources()
    {
        return $this->hasMany(Ressource::class, 'id_Programme', 'id_Programme');
    }
}
