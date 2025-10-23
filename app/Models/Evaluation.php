<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    use HasFactory;

    protected $table = 'evaluations';
    
    // Utiliser une clé primaire simple auto-incrémentée
    protected $primaryKey = 'id';
    public $incrementing = true;
    
    public $timestamps = true;

    protected $fillable = [
        'id_utilisateur',
        'id_evenement',
        'note'
    ];

    protected $casts = [
        'note' => 'integer',
        'id_utilisateur' => 'integer',
        'id_evenement' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_utilisateur');
    }

    public function evenement(): BelongsTo
    {
        return $this->belongsTo(Evenement::class, 'id_evenement', 'id_evenement');
    }
}
