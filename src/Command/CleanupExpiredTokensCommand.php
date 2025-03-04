<?php

namespace App\Command;

use App\Repository\ResetPasswordTokenRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Command\LockableTrait;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class CleanupExpiredTokensCommand extends Command
{
    use LockableTrait;
    protected static $defaultName = 'app:cleanup-expired-tokens';
    private ResetPasswordTokenRepository $tokenRepository;
    private EntityManagerInterface $entityManager;

    public function __construct(ResetPasswordTokenRepository $tokenRepository, EntityManagerInterface $entityManager)
    {
        parent::__construct();
        $this->tokenRepository = $tokenRepository;
        $this->entityManager = $entityManager;
    }

    protected function configure(): void
    {
        $this
        ->setName('app:cleanup-expired-tokens')
        ->setDescription('Supprime les tokens de réinitialisation de mot de passe expirés');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        if (!$this->lock()) {
            $output->writeln('La commande est déjà en cours d\'exécution.');

            return Command::FAILURE;
        }

        try {
            $tokens = $this->tokenRepository->findExpiredTokens();
            foreach ($tokens as $token) {
                $this->entityManager->remove($token);
            }
            $this->entityManager->flush();

            $output->writeln(sprintf('%d tokens expirés supprimés.', count($tokens)));
        } finally {
            $this->release();
        }

        return Command::SUCCESS;
    }
}
