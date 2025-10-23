<?php

namespace App\Policies;

use App\Models\Evenement;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class EvenementPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Evenement $evenement): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Evenement $evenement): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Evenement $evenement): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Evenement $evenement): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Evenement $evenement): bool
    {
        return false;
    }

    /**
     * Determine whether the user can invite participants to the event.
     */
    public function inviteParticipants(User $user, Evenement $evenement): bool
    {
        return $user->id === $evenement->id_organisateur;
    }

    /**
     * Determine whether the user can update a participant's role in the event.
     */
    public function updateParticipantRole(User $user, Evenement $evenement): bool
    {
        return $user->id === $evenement->id_organisateur;
    }

    /**
     * Determine whether the user can remove a participant from the event.
     */
    public function removeParticipant(User $user, Evenement $evenement): bool
    {
        return $user->id === $evenement->id_organisateur;
    }
}
