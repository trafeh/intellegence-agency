<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClientProposalWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $clientName,
        public string $companyName,
        public string $email,
        public ?string $password,
        public string $quoteRef,
        public string $loginUrl = 'http://localhost:5173/login'
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Vos identifiants d'accès Espace Client — Intelligence Sales ({$this->quoteRef})",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.client_welcome',
        );
    }
}
