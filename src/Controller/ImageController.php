<?php

namespace App\Controller;

use App\Entity\Image;
use App\Service\ImageService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/images', name : 'app_api_images_')]
class ImageController extends AbstractController
{
    public function __construct(
        private ImageService $imageService,
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {
    }

    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $images = $this->entityManager->getRepository(Image::class)->findAll();

        $data = $this->serializer->serialize($images, 'json', ['groups' => 'image']);

        return new JsonResponse($data, 200, [], true);
    }

    #[Route('/upload', name: 'upload_image', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        $uploadedFile = $request->files->get('image');
        $subDirectory = $request->request->get('subDirectory', '');

        if (!$uploadedFile) {
            return new JsonResponse(['error' => 'Aucun fichier fourni'], JsonResponse::HTTP_BAD_REQUEST);
        }

        try {
            $image = $this->imageService->createImage($uploadedFile, $subDirectory);

            return $this->json($image, JsonResponse::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'delete_image', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $image = $this->entityManager->getRepository(Image::class)->find($id);

        if (!$image) {
            return $this->json(['error' => 'Image introuvable'], JsonResponse::HTTP_NOT_FOUND);
        }

        try {
            $this->imageService->deleteImage($image);

            return $this->json(['message' => 'Image supprimée'], JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
