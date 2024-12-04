<?php

namespace App\Controller;

use App\Entity\Comment;
use App\Form\CommentType;
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
        private SerializerInterface $serializer
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $comments = $this->em->getRepository(Comment::class)->findAll();

        return new JsonResponse($comments, 200, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $comment = $this->em->getRepository(Comment::class)->find($id);

        if (!$comment) {
            return new JsonResponse(['error' => 'Aucune section trouve.'], 404);
        }

        return new Response($id, 200, [], true);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $comment = new Comment();
        $form = $this->createForm(CommentType::class, $comment);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($comment);
            $entityManager->flush();

            return new JsonResponse('Le commentaire est créé.', 201, []);
        }

        return new JsonResponse('Erreur lors de la création du commentaire', 404, []);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Comment $comment, EntityManagerInterface $entityManager): JsonResponse
    {
        $form = $this->createForm(CommentType::class, $comment);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return new JsonResponse('Le commentaire est créé.', 201, []);
        }

        return new JsonResponse('Erreur lors de la création du commentaire', 404, []);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $comment = $this->em->getRepository(Comment::class)->find($id);

        if (!$comment) {
            return new JsonResponse(['status' => 'error', 'message' => 'Section non trouvé'], 404);
        }

        try {
            foreach ($comment->getArticle() as $article) {
                $this->em->remove($article);
            }
            $this->em->remove($comment);
            $this->em->flush();

            return new JsonResponse(['status' => 'success', 'message' => 'Commentaire supprimé avec succès'], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur lors de la suppression : '.$e->getMessage()], 500);
        }
    }
}
