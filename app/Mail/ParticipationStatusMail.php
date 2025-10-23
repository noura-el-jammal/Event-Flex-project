<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Evenement;

class ParticipationStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $evenement;
    public $status;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, Evenement $evenement, string $status)
    {
        $this->user = $user;
        $this->evenement = $evenement;
        $this->status = $status;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = ($this->status === 'accepted') 
            ? "Confirmation de participation à l'événement '{$this->evenement->titre}'" 
            : "Annulation de participation à l'événement '{$this->evenement->titre}'";

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.participation-status',
            with: [
                'user' => $this->user,
                'evenement' => $this->evenement,
                'status' => $this->status,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
