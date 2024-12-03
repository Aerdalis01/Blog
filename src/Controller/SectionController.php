<?php

namespace App\Controller;

use App\Entity\Section;
use App\Form\SectionType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/section', name: 'app_api_section_')]
class SectionController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private SerializerInterface $serializer
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $sections = $this->em->getRepository(Section::class)->findAll();

        $data = $this->serializer->serialize($sections, 'json', ['groups' => 'section']);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $sections = $this->em->getRepository(Section::class)->find($id);

        if (!$sections) {
            return new JsonResponse(['error' => 'Aucune section trouve.'], 404);
        }

        $data = $this->serializer->serialize($sections, 'json', ['groups' => 'section']);

        return new Response($data, 200, [], true);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $section = new Section();
        $form = $this->createForm(SectionType::class, $section);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($section);
            $entityManager->flush();

            return new JsonResponse('La section est créé.', 201, []);
        }

        return new JsonResponse('Erreur lors de la création du service', 404, []);
    }

    #[Route('/{id}/edit', name: 'edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Section $section, EntityManagerInterface $entityManager): JsonResponse
    {
        $form = $this->createForm(SectionType::class, $section);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return new JsonResponse('La section a été modifié avec succès.', 201, []);
        }

        return new JsonResponse('Erreur lors de la modification de la section', 404, []);
    }

    #[Route('/{id}', name: 'app_section_delete', methods: ['POST'])]
    public function delete(int $id): JsonResponse
    {
        $section = $this->em->getRepository(Section::class)->find($id);

        if (!$section) {
            return new JsonResponse(['status' => 'error', 'message' => 'Section non trouvé'], 404);
        }

        try {
            foreach ($section->getArticle() as $article) {
                $this->em->remove($article);
            }
            $this->em->remove($section);
            $this->em->flush();

            return new JsonResponse(['status' => 'success', 'message' => 'Sectionsupprimé avec succès'], 200);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'error', 'message' => 'Erreur lors de la suppression : '.$e->getMessage()], 500);
        }
    }
}
