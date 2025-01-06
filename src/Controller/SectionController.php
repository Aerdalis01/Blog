<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Section;
use App\Form\SectionType;
use App\Repository\SectionRepository;
use App\Service\AuthenticationService;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/section', name: 'app_api_section_')]
class SectionController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private SerializerInterface $serializer,
        private LoggerInterface $logger,
        private AuthenticationService $authService,
        private JWTTokenManagerInterface $jwtManager
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $sections = $this->em->getRepository(Section::class)->findAll();

        $data = $this->serializer->serialize($sections, 'json', ['groups' => 'section']);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/{id<\d+>}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $sections = $this->em->getRepository(Section::class)->find($id);

        if (!$sections) {
            return new JsonResponse(['error' => 'Aucune section trouve.'], 400);
        }

        $data = $this->serializer->serialize($sections, 'json', ['groups' => 'section']);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié.'], 401);
        }
        $roles = $user->getRoles(); // Récupère les rôles de l'utilisateur

        if (!in_array('ROLE_ADMIN', $roles, true)) {
            return new JsonResponse(['error' => 'Accès interdit : rôle requis : ROLE_ADMIN.'], 403);
        }

        $section = new Section();
        $name = $request->request->get('name');
        $featured = $request->request->get('featured');
        if (!$name) {
            return new JsonResponse(['error' => 'Le champ "name" est requis.'], 400);
        }

        $section->setName($name);
        $section->setFeatured($featured);

        if (!$name) {
            return new JsonResponse(['error' => 'Le champ "name" est requis.'], 400);
        }

        if (!is_bool(filter_var($featured, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE))) {
            return new JsonResponse(['error' => 'Le champ "featured" doit être un booléen.'], 400);
        }

        $entityManager->persist($section);
        $entityManager->flush();

        return new JsonResponse('La section est créée.', 201, []);

        return new JsonResponse([
            'error' => 'Le formulaire contient des erreurs.',
            'details' => (string) $form->getErrors(true, false),
        ], 400);

        return new JsonResponse('Formulaire non soumis.', 400);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, Section $section, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié.'], 401);
        }
        $roles = $user->getRoles(); // Récupère les rôles de l'utilisateur

        if (!in_array('ROLE_ADMIN', $roles, true)) {
            return new JsonResponse(['error' => 'Accès interdit : rôle requis : ROLE_ADMIN.'], 403);
        }
        $featured = $request->request->get('featured');

        if ($featured !== null) {
            $section->setFeatured(filter_var($featured, FILTER_VALIDATE_BOOLEAN));
        }

        $submittedData = [
            'name' => $request->get('name'),
        ];

        $form = $this->createForm(SectionType::class, $section);
        $form->submit($submittedData, false);

        if ($form->isSubmitted() && $form->isValid()) {
            // Retirer les anciens articles non inclus dans la nouvelle soumission
            if ($request->request->has('articles')) {
                $submittedArticles = $request->request->get('articles', []);

                // Retirer les articles non inclus dans la soumission
                $submittedArticles = is_array($submittedArticles)
                ? $submittedArticles
                : json_decode($submittedArticles, true);

                if (!is_array($submittedArticles)) {
                    throw new \InvalidArgumentException("Le champ 'articles' doit être un tableau ou un JSON valide.");
                }

                foreach ($section->getArticles() as $existingArticle) {
                    if (!in_array($existingArticle->getId(), $submittedArticles)) {
                        $existingArticle->setSection(null);
                    }
                }

                // Ajouter les nouveaux articles
                foreach ($submittedArticles as $articleId) {
                    $article = $entityManager->getRepository(Article::class)->find($articleId);
                    if ($article) {
                        if ($article->getSection() !== $section) {
                            $article->setSection($section);
                        }
                    } else {
                        return new JsonResponse("L'article ID $articleId n'existe pas.", 400);
                    }
                }
            }

            $entityManager->flush();

            return new JsonResponse('La section a été modifiée avec succès.', 201);
        }

        // Gestion des erreurs de formulaire
        $errors = [];
        foreach ($form->getErrors(true) as $error) {
            $errors[] = $error->getMessage();
        }

        return new JsonResponse(['errors' => $errors], 400);
    }

    #[Route('/delete/{id}', name: 'app_section_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié.'], 401);
        }
        $roles = $user->getRoles(); // Récupère les rôles de l'utilisateur

        if (!in_array('ROLE_ADMIN', $roles, true)) {
            return new JsonResponse(['error' => 'Accès interdit : rôle requis : ROLE_ADMIN.'], 403);
        }
        $section = $this->em->getRepository(Section::class)->find($id);

        if (!$section) {
            return new JsonResponse(['status' => 'error', 'message' => 'Section non trouvé'], 400);
        }

        try {
            foreach ($section->getArticles() as $article) {
                $this->em->remove($article);
            }
            $this->em->remove($section);
            $this->em->flush();

            return new JsonResponse(['status' => 'success', 'message' => 'Sectionsupprimé avec succès'], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur lors de la suppression : '.$e->getMessage()], 500);
        }
    }

    #[Route('/featured', name: 'api_sections_featured', methods: ['GET'])]
    public function getFeaturedSections(SectionRepository $sectionRepository, SerializerInterface $serializer, Request $request): JsonResponse
    {
        $featuredSections = $sectionRepository->findFeaturedSections();

        $data = $serializer->serialize($featuredSections, 'json', ['groups' => 'section']);

        return new JsonResponse($data, 200, [], true);
    }
}
