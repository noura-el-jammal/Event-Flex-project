<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('chat.' . min($this->message->id_utilisateur, $this->message->id_destinataire) . '.' . max($this->message->id_utilisateur, $this->message->id_destinataire));
    }

    public function broadcastWith()
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'contenu' => $this->message->contenu,
                'date_envoi' => $this->message->date_envoi,
                'id_utilisateur' => $this->message->id_utilisateur,
                'id_destinataire' => $this->message->id_destinataire,
                'user' => $this->message->user
            ]
        ];
    }
} 