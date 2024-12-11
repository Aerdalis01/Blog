<?php

namespace App\Form;

use App\Entity\Article;
use App\Entity\Comment;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CommentType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('author')
            ->add('text')
            ->add('article', EntityType::class, [
                'class' => Article::class,
                'choice_label' => 'id',
                'query_builder' => function (EntityRepository $er) {
                    return $er->createQueryBuilder('a')->orderBy('a.id', 'ASC');
                },
                'invalid_message' => 'L\'article sélectionné est invalide.',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Comment::class,
            'csrf_protection' => false,
        ]);
    }
}
