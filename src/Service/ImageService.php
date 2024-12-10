<?php

namespace App\Service;

use App\Entity\Image;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageService
{
    private string $uploadDirectory;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private LoggerInterface $logger,
        string $uploadDirectory
    ) {
        $this->uploadDirectory = $uploadDirectory;
    }

    public function createImage(UploadedFile $file, string $subDirectory = ''): Image
    {
        // Valider le fichier uploadé (type et taille).
        $this->validateFile($file);

        try {
            // Générer un nom unique pour le fichier avec une extension appropriée.
            $fileName = uniqid('img_', true).'.'.$file->guessExtension();

            // Construire le chemin complet où le fichier sera sauvegardé.
            $filePath = $this->buildTargetPath($subDirectory, $fileName);

            // Créer le répertoire cible s'il n'existe pas.
            $targetDirectory = dirname($filePath);
            if (!is_dir($targetDirectory)) {
                mkdir($targetDirectory, 0777, true);
            }

            // Déplacer le fichier vers le répertoire cible.
            $file->move($targetDirectory, $fileName);

            // Créer une nouvelle entité Image avec les détails du fichier.
            $image = new Image();
            $image->setName($fileName);
            $image->setUrl($subDirectory.'/'.$fileName);

            // Persister l'entité Image dans la base de données.
            $this->entityManager->persist($image);
            $this->entityManager->flush();

            // Enregistrer un log de succès.
            $this->logger->info('Image uploadée avec succès : '.$filePath);

            return $image;
        } catch (\Exception $e) {
            // Enregistrer un log d'erreur et lancer une exception en cas d'échec.
            $this->logger->error("Erreur lors de l'upload de l'image : ".$e->getMessage());
            throw new \RuntimeException("Erreur lors de l'upload de l'image.");
        }
    }

    /**
     * Supprime un fichier du système de fichiers et son entité correspondante.
     *
     * @param Image $image L'entité Image à supprimer
     */
    public function deleteImage(Image $image): void
    {
        // Construire le chemin complet du fichier à supprimer.
        $filePath = $this->buildTargetPath($image->getUrl(), '');

        // Vérifier si le fichier existe et le supprimer.
        if (file_exists($filePath)) {
            unlink($filePath);
            $this->logger->info('Fichier supprimé : '.$filePath);
        } else {
            $this->logger->warning("Tentative de suppression d'un fichier inexistant : ".$filePath);
        }

        // Supprimer l'entité Image de la base de données.
        $this->entityManager->remove($image);
        $this->entityManager->flush();
    }

    /**
     * Met à jour une image existante en supprimant l'ancienne et en uploadant une nouvelle.
     *
     * @param Image        $existingImage L'entité Image existante à remplacer
     * @param UploadedFile $newFile       le nouveau fichier uploadé
     * @param string       $subDirectory  le sous-répertoire où stocker le nouveau fichier
     *
     * @return Image la nouvelle entité Image
     */
    public function updateImage(Image $existingImage, UploadedFile $newFile, string $subDirectory = ''): Image
    {
        // Supprimer l'ancienne image.
        $this->deleteImage($existingImage);

        // Créer et retourner une nouvelle image.
        return $this->createImage($newFile, $subDirectory);
    }

    /**
     * Valide le fichier uploadé.
     *
     * Vérifie si le fichier a une extension autorisée et une taille valide.
     *
     * @param UploadedFile $file le fichier à valider
     *
     * @throws \InvalidArgumentException si le fichier est invalide
     */
    private function validateFile(UploadedFile $file): void
    {
        // Extensions autorisées.
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array($file->guessExtension(), $allowedExtensions)) {
            throw new \InvalidArgumentException('Extension de fichier non autorisée.');
        }

        // Taille maximale autorisée (5 Mo).
        $maxFileSize = 5 * 1024 * 1024; // 5 Mo
        if ($file->getSize() > $maxFileSize) {
            throw new \InvalidArgumentException('Le fichier dépasse la taille maximale autorisée.');
        }
    }

    /**
     * Construit le chemin complet pour stocker un fichier.
     *
     * @param string $subDirectory le sous-répertoire
     * @param string $fileName     le nom du fichier
     *
     * @return string le chemin complet
     */
    private function buildTargetPath(string $subDirectory, string $fileName): string
    {
        return $this->uploadDirectory.DIRECTORY_SEPARATOR.trim($subDirectory, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$fileName;
    }
}
