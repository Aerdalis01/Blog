<?php

namespace App\Repository;

use App\Entity\Section;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Section>
 */
class SectionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Section::class);
    }

   

    public function findFeaturedSections(): array
    {
        return $this->createQueryBuilder('s')
        ->addSelect('a') // Charger les articles
        ->leftJoin('s.articles', 'a')
        ->where('s.featured = :featured')
        ->setParameter('featured', true)
        ->orderBy('a.createdAt', 'DESC') // Trier les articles par date de création
        ->getQuery()
        ->getResult();
    }
}
