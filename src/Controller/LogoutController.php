<?php

namespace App\Controller;

use App\Entity\Token;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class LogoutController
{
    public function __construct(
        private EntityManagerInterface $em,
        private TokenStorageInterface $tokenStorage,
        private Security $security
    ) {
    }

    #[Route('/api/logout', name: 'app_api_logout_', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new JsonResponse(['error' => 'Token manquant ou invalide'], 400);
        }

        $jwtToken = trim(substr($authHeader, 7));
        $token = $this->em->getRepository(Token::class)->findOneBy(['jwtToken' => $jwtToken]);

        /** @var \App\Entity\User $user */
        $user = $token->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur introuvable pour ce token'], 404);
        }

        try {
            $this->em->remove($token);
            $this->em->flush();
        } finally {
            $this->tokenStorage->setToken(null);
        }

        return new JsonResponse(['message' => 'Déconnexion réussie. Supprimez le token local.'], 200);
    }
}
