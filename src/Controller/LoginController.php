<?php

namespace App\Controller;

use App\Entity\Token;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class LoginController
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $passwordHasher,
        private JWTTokenManagerInterface $jwtManager,
        private RateLimiterFactory $anonymousApiLimiter
    ) {
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, AuthenticationUtils $authenticationUtils): JsonResponse
    {
        $limiter = $this->anonymousApiLimiter->create($request->getClientIp());

        if (false === $limiter->consume(1)->isAccepted()) {
            throw new TooManyRequestsHttpException();
        }

        // Récupérer les données depuis FormData
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        if (!$email || !$password) {
            throw new BadRequestHttpException('Email et mot de passe sont requis.');
        }

        // Rechercher l'utilisateur par email
        $user = $this->em->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Identifiants incorrects.'], Response::HTTP_UNAUTHORIZED);
        }
        $roles = $user->getRoles();
        $jwt = $this->jwtManager->createFromPayload($user, [
            'roles' => $roles,
        ]);

        $token = new Token();
        $token->setJwtToken($jwt)
              ->setUser($user)
              ->setExpireAt((new \DateTimeImmutable())->modify('+2 hour'))
              ->setCreatedAt(new \DateTimeImmutable());

        $this->em->persist($token);
        $this->em->flush();

        // Retourner le token JWT
        return new JsonResponse(['token' => $jwt, 'roles' => $roles], Response::HTTP_OK);
    }
}
