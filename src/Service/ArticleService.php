<?php

namespace App\Service;

use App\Entity\Article;
use App\Entity\Comment;
use App\Entity\Section;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Loader\Configurator\AbstractServiceConfigurator;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ArticleService extends AbstractServiceConfigurator
{
    public function __construct(
        private ImageService $imageService,
        private EntityManagerInterface $em
    ) {
    }

    public function handleArticleData(Article $article, ?UploadedFile $imageFile, array $sectionIds, array $commentsIds): void
    {
        if ($imageFile) {
            $image = $this->imageService->createImage($imageFile);
            $article->setImage($image);
        }

        if ($sectionIds) {
            $section = $this->em->getRepository(Section::class)->find($sectionIds[0]);
            $article->setSection($section);
        }

        $comments = $this->em->getRepository(Comment::class)->findBy(['id' => $commentsIds]);
        foreach ($comments as $comment) {
            $article->addComment($comment);
        }

        $this->em->persist($article);
        $this->em->flush();
    }
}
