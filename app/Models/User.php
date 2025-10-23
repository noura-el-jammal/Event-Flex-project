<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
  // Relation : événements créés par l'utilisateur (organisateur)
     
    public function evenementsCrees()
    {
        return $this->hasMany(Evenement::class, 'id_organisateur');
    }

    /**
     * 🔹 Messages envoyés par l'utilisateur
     */
    public function messagesEnvoyes()
    {
        return $this->hasMany(Message::class, 'id_utilisateur');
    }

    /**
     * 🔹 Messages reçus par l'utilisateur
     */
    public function messagesRecus()
    {
        return $this->hasMany(Message::class, 'id_destinataire');
    }

    /**
     * 🔹 Notifications reçues
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'id_utilisateur');
    }

    /**
     * 🔹 Publications postées
     */
    public function publications()
    {
        return $this->hasMany(Publication::class, 'id_utilisateur');
    }

    /**
     * 🔹 Evaluations données par l'utilisateur
     */
    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'id_utilisateur');
    }

    /**
     * 🔹 Programmes favoris de l'utilisateur
     */
    public function favoris()
    {
        return $this->hasMany(Favori::class, 'id_utilisateur');
    }

    /**
     * 🔹 Événements auxquels l'utilisateur participe (pivot)
     */
    public function participations()
    {
        return $this->hasMany(Participant::class, 'id_utilisateur');
    }

    /**
     * Vérifie si l'utilisateur est un organisateur
     */
    public function isOrganisateur(): bool
    {
        return $this->role === 'organisateur';
    }

    /**
     * Vérifie si l'utilisateur est un participant
     */
    public function isParticipant(): bool
    {
        return $this->role === 'participants';
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'id_utilisateur');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'id_destinataire');
    }
}

