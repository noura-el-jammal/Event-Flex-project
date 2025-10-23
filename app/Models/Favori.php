<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favori extends Model
{
    use HasFactory;

    protected $table = 'favoris';
    protected $primaryKey = ['id_utilisateur', 'id_evenement'];
    public $incrementing = false;
    public $timestamps = true;

    protected $fillable = [
        'id_utilisateur',
        'id_evenement'
    ];

    /**
     * Get the user that owns the favorite.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_utilisateur');
    }

    /**
     * Get the evenement that is favorited.
     */
    public function evenement(): BelongsTo
    {
        return $this->belongsTo(Evenement::class, 'id_evenement', 'id_evenement');
    }
}
