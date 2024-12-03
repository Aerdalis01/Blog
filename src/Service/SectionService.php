<?php

namespace App\Service;

use App\Entity\Article;
use App\Entity\Section;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Loader\Configurator\AbstractServiceConfigurator;

class SectionService extends AbstractServiceConfigurator
{
    public function __construct(
        private EntityManagerInterface $em
    ) {
    }

    public function handleTagData(Section $section, array $articleIds): void
    {
        $articles = $this->em->getRepository(Article::class)->findBy(['id' => $articleIds]);

        foreach ($articles as $article) {
            $section->addArticle($article);
        }

        $this->em->persist($section);
        $this->em->flush();
    }
}
