<?php

namespace App\Service;

use Symfony\Component\Mailer\Envelope;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\RawMessage;

class FakeMailerService implements MailerInterface
{
    public function send(RawMessage $message, ?Envelope $envelope = null): void
    {
        if ($message instanceof Email) {
            // Simuler l'envoi d'un email
            dump('Email simulé :', [
                'To' => $message->getTo(),
                'Subject' => $message->getSubject(),
                'Body' => $message->getHtmlBody(),
                'Envelope' => $envelope,
            ]);
        } else {
            // Gérer les autres types de messages RawMessage (si nécessaires)
            dump('Message brut simulé :', [
                'Message' => $message->toString(),
                'Envelope' => $envelope,
            ]);
        }
    }
}
