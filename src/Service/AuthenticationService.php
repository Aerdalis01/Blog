<?php

namespace App\Service;

use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthenticationService
{
    public function __construct(
        private TokenStorageInterface $tokenStorage,
        private AuthorizationCheckerInterface $authorizationChecker
    ) {
    }

    /**
     * Récupère l'utilisateur courant.
     *
     * @throws \LogicException si aucun utilisateur n'est authentifié
     */
    public function getCurrentUser(Request $request): UserInterface
    {
        dd($request->headers->get('Authorization'));
        $token = $this->tokenStorage->getToken();
        dd($token);
        if ($token === null || !$token->getUser() instanceof UserInterface) {
            throw new \LogicException('Aucun utilisateur authentifié.');
        }

        return $token->getUser();
    }

    /**
     * Vérifie si l'utilisateur actuel possède un rôle spécifique.
     *
     * @throws AccessDeniedException si l'utilisateur n'a pas le rôle requis
     */
    public function ensureHasRole(string $role): void
    {
        if (!$this->authorizationChecker->isGranted($role)) {
            throw new AccessDeniedException("Accès interdit. Rôle requis : $role.");
        }
    }

    /**
     * Vérifie si l'utilisateur actuel possède un rôle spécifique.
     */
    public function hasRole(string $role): bool
    {
        return $this->authorizationChecker->isGranted($role);
    }
}
