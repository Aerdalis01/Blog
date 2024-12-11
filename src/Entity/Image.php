<?php

namespace App\Entity;

use App\Repository\ImageRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
#[HasLifecycleCallbacks]
class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['image', 'section', 'article'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['image', 'section', 'article'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['image', 'section', 'article'])]
    private ?string $url = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\OneToOne(mappedBy: 'image', cascade: ['persist', 'remove'])]
    private ?Article $article = null;

    #[ORM\PrePersist]
    public function setCreatedAt(): void
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): static
    {
        $this->url = $url;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getArticle(): ?Article
    {
        return $this->article;
    }

    public function setArticle(?Article $article): static
    {
        // unset the owning side of the relation if necessary
        if ($article === null && $this->article !== null) {
            $this->article->setImage(null);
        }

        // set the owning side of the relation if necessary
        if ($article !== null && $article->getImage() !== $this) {
            $article->setImage($this);
        }

        $this->article = $article;

        return $this;
    }
}
