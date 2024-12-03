<?php

namespace App\Service;

use App\Entity\Image;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageService
{
    private string $uploadDirectory;

    public function __construct(
        private EntityManagerInterface $entityManager,
        string $uploadDirectory
    ) {
        $this->uploadDirectory = $uploadDirectory;
    }

    /**
     * Crée une nouvelle entité Image et gère l'upload du fichier.
     */
    public function createImage(UploadedFile $file, string $subDirectory = ''): Image
    {
        // Générer un nom unique pour le fichier
        $fileName = uniqid('img_', true).'.'.$file->guessExtension();

        // Construire le chemin de destination
        $targetDirectory = $this->uploadDirectory.'/'.trim($subDirectory, '/');
        if (!is_dir($targetDirectory)) {
            mkdir($targetDirectory, 0777, true);
        }

        // Déplacer le fichier dans le répertoire cible
        $file->move($targetDirectory, $fileName);

        // Créer l'entité Image
        $image = new Image();
        $image->setName($fileName);
        $image->setUrl($subDirectory.'/'.$fileName);

        // Persister l'entité dans la base de données
        $this->entityManager->persist($image);
        $this->entityManager->flush();

        return $image;
    }

    /**
     * Supprime un fichier du système de fichiers et son entité correspondante.
     */
    public function deleteImage(Image $image): void
    {
        $filePath = $this->uploadDirectory.'/'.$image->getUrl();

        // Supprimer le fichier du système de fichiers
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        // Supprimer l'entité Image
        $this->entityManager->remove($image);
        $this->entityManager->flush();
    }

    /**
     * Met à jour une image existante.
     */
    public function updateImage(Image $existingImage, UploadedFile $newFile, string $subDirectory = ''): Image
    {
        // Supprimer l'ancien fichier
        $this->deleteImage($existingImage);

        // Créer une nouvelle image
        return $this->createImage($newFile, $subDirectory);
    }
}
