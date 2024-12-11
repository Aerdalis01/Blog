<?php

namespace App\Controller;

use App\Entity\Article;
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

        $data = $this->serializer->serialize($comments, 'json', ['groups' => 'comment']);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $comment = $this->em->getRepository(Comment::class)->find($id);

        if (!$comment) {
            return new JsonResponse(['error' => 'Aucune section trouve.'], 400);
        }

        return new Response($id, 200, [], true);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // dd($request->request->all());
        $articleId = $request->get('articleId');

        // Récupération de l'entité Article à partir de l'ID
        $article = $entityManager->getRepository(Article::class)->find($articleId);
        // dd($entityManager->contains($article));
        if (!$article) {
            return new JsonResponse(['error' => 'Article non trouvé'], 404);
        }

        $comment = new Comment();
        $form = $this->createForm(CommentType::class, $comment);
        $formData = [
            'text' => $request->get('text'),
            'author' => $request->get('author'),
            'article' => $article->getId(),
        ];

        // dd('formdata', $formData);
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

        $comment->setText($text);
        $comment->setUpdatedAt(new \DateTimeImmutable());
        $em->flush();

        return new JsonResponse(['message' => 'Commentaire mis à jour avec succès'], 200);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $comment = $this->em->getRepository(Comment::class)->find($id);

        if (!$comment) {
            return new JsonResponse(['status' => 'error', 'message' => 'Section non trouvé'], 400);
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
