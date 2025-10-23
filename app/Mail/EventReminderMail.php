<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Evenement;

class EventReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $evenement;

    /**
     * Create a new message instance.
     */
    public function __construct(Evenement $evenement)
    {
        $this->evenement = $evenement;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Rappel : L'événement '{$this->evenement->titre}' commence bientôt !",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.event-reminder',
            with: [
                'evenement' => $this->evenement,
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
