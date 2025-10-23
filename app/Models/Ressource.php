<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Programme;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ressource extends Model
{
    use HasFactory;
    
    protected $primaryKey = 'id_Ressource';
    protected $table = 'ressources';

    protected $fillable = ['url_fichier', 'id_Programme'];

    public function programme()
    {
        return $this->belongsTo(Programme::class, 'id_Programme', 'id_Programme');
    }
}
