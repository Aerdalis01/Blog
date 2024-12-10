<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Image;
use App\Entity\Section;
use App\Form\ArticleType;
use App\Service\ImageService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/article', name: 'app_api_article_')]
class ArticleController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private SerializerInterface $serializer,
        private ImageService $imageService
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $articles = $this->em->getRepository(Article::class)->findAll();

        $data = $this->serializer->serialize($articles, 'json', ['groups' => 'article']);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $articles = $this->em->getRepository(Article::class)->find($id);

        if (!$articles) {
            return new JsonResponse(['error' => 'Aucune section trouve.'], 404);
        }

        $data = $this->serializer->serialize($articles, 'json', ['groups' => 'article']);

        return new Response($data, 200, [], true);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $article = new Article();
        $sectionId = $request->get('sectionId');
        if (!$sectionId) {
            return new JsonResponse(['error' => 'Section non trouvée'], 400);
        }
        if ($sectionId) {
            $section = $this->em->getRepository(Section::class)->find($sectionId);
            $article->setSection($section);
        }

        // Gestion de l'image
        $imageId = $request->get('imageId');
        if ($imageId) {
            $image = $this->em->getRepository(Image::class)->find($imageId);
            if (!$image) {
                return new JsonResponse(['error' => 'Image non trouvée'], 400);
            }
            $article->setImage($image);
        }
        $form = $this->createForm(ArticleType::class, $article);
        $formData = [
            'title' => $request->get('title'),
            'text' => $request->get('text'),
            'author' => $request->get('author'),
        ];
        $form->submit($formData);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($article);
            $entityManager->flush();

            return new JsonResponse('L\'article est créé.', 201, []);
        }

        return new JsonResponse("Erreur lors de la creation de l'article", 404, []);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Article $article, EntityManagerInterface $entityManager): JsonResponse
    {
        $sectionId = $request->get('sectionId');
        if ($sectionId) {
            $newSection = $this->em->getRepository(Section::class)->find($sectionId);
            if (!$newSection) {
                return new JsonResponse(['error' => 'Section non trouvée'], 400);
            }

            // Vérifiez si la section change
            if ($article->getSection() !== $newSection) {
                $article->setSection($newSection);
            }
        }

        // Gestion de l'image
        $imageId = $request->get('imageId');

        if ($imageId) {
            $newImage = $this->em->getRepository(Image::class)->find($imageId);
            if (!$newImage) {
                return new JsonResponse(['error' => 'Image non trouvée'], 400);
            }

            // Vérifiez s'il existe une ancienne image et supprimez-la
            $oldImage = $article->getImage();
            if ($oldImage && $oldImage->getId() !== $newImage->getId()) {
                $this->em->remove($oldImage);
            }

            $article->setImage($newImage);
        }

        $form = $this->createForm(ArticleType::class, $article);
        $formData = [
            'title' => $request->get('title'),
            'text' => $request->get('text'),
            'author' => $request->get('author'),
        ];
        $form->submit($formData);
        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return new JsonResponse('La section a été modifié avec succès.', 201, []);
        }

        return new JsonResponse('Erreur lors de la modification de la section', 404, []);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $article = $this->em->getRepository(Article::class)->find($id);

        if (!$article) {
            return new JsonResponse(['status' => 'error', 'message' => 'Article non trouvé'], 404);
        }

        $this->em->remove($article);
        $this->em->flush();

        return new JsonResponse(['status' => 'success', 'message' => 'Sectionsupprimé avec succès'], 200);

        return new JsonResponse(['status' => 'error', 'message' => 'Erreur lors de la suppression : '.$e->getMessage()], 500);
    }
}
