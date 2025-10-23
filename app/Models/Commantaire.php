<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commantaire extends Model
{
    use HasFactory;

    protected $table = 'commantaires';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'contenu',
        'date_envoi',
        'id_publication',
        'id_utilisateur'
    ];

    protected $casts = [
        'date_envoi' => 'datetime'
    ];

    public function publication()
    {
        return $this->belongsTo(Publication::class, 'id_publication', 'id_publication');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_utilisateur', 'id');
    }
}
