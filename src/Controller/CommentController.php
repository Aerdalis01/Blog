<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Comment;
use App\Form\CommentType;
use App\Service\CommentFilterService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/comment', name: 'app_api_comment_')]
class CommentController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private SerializerInterface $serializer,
        private CommentFilterService $commentFilter
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $comments = $this->em->getRepository(Comment::class)->findAll();

        $data = $this->serializer->serialize($comments, 'json', ['groups' => 'comment']);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/{id<\d+>}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $comment = $this->em->getRepository(Comment::class)->find($id);

        if (!$comment) {
            return new JsonResponse(['error' => 'Aucune commentaire trouve.'], 400);
        }
        $data = $this->serializer->serialize($comment, 'json', ['groups' => 'comment']);

        return new Response($data, 200, [], true);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $articleId = $request->get('articleId');

        $article = $entityManager->getRepository(Article::class)->find($articleId);

        if (!$article) {
            return new JsonResponse(['error' => 'Article non trouvé'], 404);
        }

        $comment = new Comment();
        $form = $this->createForm(CommentType::class, $comment);

        $text = $this->commentFilter->filter($request->get('text'));
        $formData = [
            'text' => $text,
            'author' => $request->get('author'),
            'article' => $article->getId(),
        ];

        $form->submit($formData);
        if (!$form->isValid()) {
            return new JsonResponse([
                'error' => 'Formulaire invalide',
                'details' => (string) $form->getErrors(true, false),
            ], 400);
        }

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($comment);
            $entityManager->flush();

            return new JsonResponse('Le commentaire est créé.', 201, []);
        }

        return new JsonResponse('Erreur lors de la création du commentaire', 400, []);
    }

    #[Route('/{id}/edit', name: 'edit_comment', methods: ['POST'])]
    public function edit(Request $request, Comment $comment, EntityManagerInterface $em): JsonResponse
    {
        $text = $request->request->get('text');

        if (!$text) {
            return new JsonResponse(['error' => 'Le texte est requis'], 400);
        }

        $filteredText = $this->commentFilter->filter($text);
        $comment->setText($filteredText);
        $comment->setUpdatedAt(new \DateTimeImmutable());
        $em->flush();

        return new JsonResponse(['message' => 'Commentaire mis à jour avec succès'], 200);
    }

    #[Route('/{id}/delete', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request): JsonResponse
    {
        $comment = $this->em->getRepository(Comment::class)->find($id);

        if (!$comment) {
            return new JsonResponse(['status' => 'error', 'message' => 'Commentairenon trouvé'], 400);
        }

        $this->em->remove($comment);
        $this->em->flush();

        return new JsonResponse(['status' => 'success', 'message' => 'Commentaire supprimé avec succès'], 200);

        return new JsonResponse(['status' => 'error', 'message' => 'Erreur lors de la suppression : '.$e->getMessage()], 500);
    }

    #[Route('/{id}/moderate', name: 'moderate_comment', methods: ['POST'])]
    public function moderateComment(Request $request, int $id): JsonResponse
    {
        $comment = $this->em->getRepository(Comment::class)->find($id);

        if (!$comment) {
            return new JsonResponse(['error' => 'Commentaire non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['status']) || !in_array($data['status'], ['approved', 'rejected'])) {
            return new JsonResponse(['error' => 'Statut invalide'], 400);
        }

        $comment->setModerationStatus($data['status']);
        if ($data['status'] === 'approved') {
            $comment->setIsFlagged(false); // Retirer le drapeau si approuvé
        }

        $this->em->flush();

        return new JsonResponse(['message' => 'Commentaire modéré avec succès'], 200);
    }

    #[Route('/flagged', name: 'get_flagged_comments', methods: ['GET'])]
    public function getFlaggedComments(): JsonResponse
    {
        $flaggedComments = $this->em->getRepository(Comment::class)->findBy(['isFlagged' => true]);

        $data = $this->serializer->serialize($flaggedComments, 'json', ['groups' => 'comment']);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/{id}/flag', name: 'flag_comment', methods: ['POST'])]
    public function flagComment(int $id): JsonResponse
    {
        $comment = $this->em->getRepository(Comment::class)->find($id);

        if (!$comment) {
            return new JsonResponse(['error' => 'Commentaire non trouvé'], 404);
        }

        $comment->setIsFlagged(true);
        $comment->setModerationStatus('pending'); // Statut "en attente"
        $this->em->flush();

        return new JsonResponse(['message' => 'Commentaire signalé avec succès'], 200);
    }
}
