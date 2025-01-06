<?php

namespace App\Controller;

use App\Entity\ResetPasswordToken;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/user', name: 'app_api_user_')]
class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private SerializerInterface $serializer,
        private LoggerInterface $logger,
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié.'], 401);
        }
        $roles = $user->getRoles(); // Récupère les rôles de l'utilisateur

        if (!in_array('ROLE_ADMIN', $roles, true)) {
            return new JsonResponse(['error' => 'Accès interdit : rôle requis : ROLE_ADMIN.'], 403);
        }
        $users = $this->em->getRepository(User::class)->findAll();

        $data = $this->serializer->serialize($users, 'json', ['groups' => 'user']);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/{id<\d+>}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié.'], 401);
        }
        $roles = $user->getRoles(); // Récupère les rôles de l'utilisateur

        if (!in_array('ROLE_ADMIN', $roles, true)) {
            return new JsonResponse(['error' => 'Accès interdit : rôle requis : ROLE_ADMIN.'], 403);
        }
        $users = $this->em->getRepository(User::class)->find($id);

        if (!$users) {
            return new JsonResponse(['error' => 'Aucune section trouve.'], 400);
        }

        $data = $this->serializer->serialize($users, 'json', ['groups' => 'user']);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/{id}/edit', name: 'edit_role', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function HandleRoleUser(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié.'], 401);
        }
        $roles = $user->getRoles(); // Récupère les rôles de l'utilisateur

        if (!in_array('ROLE_ADMIN', $roles, true)) {
            return new JsonResponse(['error' => 'Accès interdit : rôle requis : ROLE_ADMIN.'], 403);
        }

        $rawContent = $request->getContent();

        $data = json_decode($rawContent, true);

        $validRoles = ['ROLE_USER', 'ROLE_MODERATOR', 'ROLE_ADMIN'];

        if (json_last_error() !== JSON_ERROR_NONE) {
            return new JsonResponse(['error' => 'Données JSON invalides'], 400);
        }

        $userId = $data['userId'] ?? null;
        $role = $data['roles'][0] ?? null;

        if (!$userId || !$role) {
            return new JsonResponse(['error' => 'Données utilisateur ou rôle manquantes'], 400);
        }

        if (!in_array($role, $validRoles, true)) {
            return new JsonResponse(['error' => 'Rôle invalide'], 400);
        }

        $currentUser = $this->em->getRepository(User::class)->find($userId);
        if (!$currentUser) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 400);
        }

        // Mettez à jour l'utilisateur
        $currentUser->setRoles([$role]); // Les rôles doivent être un tableau
        $currentUser->setUpdatedAt(new \DateTimeImmutable());
        $this->em->flush();

        return new JsonResponse(['message' => 'Utilisateur mis à jour avec succès'], 200);
    }

    #[Route('/{id}/delete', name: 'app_section_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $user = $this->em->getRepository(User::class)->find($id);

        if (!$user) {
            return new JsonResponse(['status' => 'error', 'message' => 'User non trouvé'], 400);
        }

        $this->em->remove($user);
        $this->em->flush();

        return new JsonResponse(['status' => 'success', 'message' => 'User supprimé avec succès'], 200);
    }

    #[Route('/forgot-password', name: 'forgot_password', methods: ['POST'])]
    public function forgotPassword(Request $request, MailerInterface $mailer): JsonResponse
    {
        $data = $request->toArray();
        $email = $data['email'] ?? null;

        if (!$email) {
            return new JsonResponse(['error' => 'L\'adresse email est requise.'], 400);
        }

        $user = $this->em->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['message' => 'Si cet email existe, un lien de réinitialisation a été envoyé.'], 200);
        }
        $existingToken = $this->em->getRepository(ResetPasswordToken::class)->findOneBy(['user' => $user]);
        if ($existingToken) {
            $this->em->remove($existingToken);
            $this->em->flush();
        }

        $resetToken = bin2hex(random_bytes(32));
        $resetPasswordToken = new ResetPasswordToken();
        $resetPasswordToken->setToken($resetToken);
        $resetPasswordToken->setExpireAt((new \DateTimeImmutable())->modify('+1 hour'));
        $resetPasswordToken->setcreatedAt(new \DateTimeImmutable());
        $resetPasswordToken->setUser($user);

        $this->em->persist($resetPasswordToken);
        $this->em->flush();

        $resetLink = sprintf('%s/reset-password/%s', $request->getSchemeAndHttpHost(), $resetToken);

        $emailMessage = (new Email())
            ->from('noreply@example.com')
            ->to($email)
            ->subject('Réinitialisation de votre mot de passe')
            ->html(sprintf('<p>Pour réinitialiser votre mot de passe, cliquez sur le lien suivant :</p><a href="%s">%s</a>', $resetLink, $resetLink));

        $mailer->send($emailMessage);

        return new JsonResponse([
            'message' => 'Mot de passe réinitialisé avec succès.',
            'redirectTo' => '/login',
        ], 200);
    }

    #[Route('/reset-password/{token}', name: 'edit_password', methods: ['PUT'])]
    public function HandlePasswordUser(string $token): JsonResponse
    {
        $password = $data['password'] ?? null;
        $confirmPassword = $data['confirmPssword'] ?? null;

        if (!$password || !$confirmPassword || $password !== $confirmPassword) {
            return new JsonResponse(['error' => 'Les mots de passe sont invalides ou ne correspondent pas.'], 400);
        }

        $resetPasswordToken = $this->em->getRepository(ResetPasswordToken::class)->findOneBy(['token' => $token]);

        if (!$resetPasswordToken || $resetPasswordToken->getExpireAt() < new \DateTimeImmutable()) {
            return new JsonResponse(['error' => 'Le lien de réinitialisation est invalide ou expiré.'], 400);
        }

        // Mettre à jour le mot de passe
        $user = $resetPasswordToken->getUser();
        $user->setPassword($this->passwordHasher->hashPassword($user, $password));

        // Invalider le token
        $this->em->remove($resetPasswordToken);
        $this->em->flush();

        return new JsonResponse(['message' => 'Mot de passe réinitialisé avec succès.'], 200);
    }

    #[Route('/me', name: 'api_user_me', methods: ['GET'])]
    public function getCurrentUser(): JsonResponse
    { /** @var App\Entity\User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], 401);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'pseudo' => $user->getPseudo(),
        ]);
    }
}
