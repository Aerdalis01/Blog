<?php

namespace App\Repository;

use App\Entity\Article;
use App\Entity\Section;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Article>
 */
class ArticleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Article::class);
    }

    //    /**
    //     * @return Article[] Returns an array of Article objects
    //     */
    public function findLatestArticle(int $limit = 1): array
    {
        return $this->createQueryBuilder('a')
            ->orderBy('a.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult()
        ;
    }

    public function findLatestArticleBySection(Section $section): array
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.section = :section')    // Filtre par ID de section
            ->setParameter('sectionId', $section)
            ->orderBy('a.createdAt', 'DESC')       // Trie par date
            ->setMaxResults(1)                // Limite les résultats
            ->getQuery()
            ->getResult();
    }

    //    public function findOneBySomeField($value): ?Article
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
