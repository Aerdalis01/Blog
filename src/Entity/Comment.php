<?php

namespace App\Entity;

use App\Repository\CommentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\HasLifecycleCallbacks;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: CommentRepository::class)]
#[HasLifecycleCallbacks]
class Comment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article', 'comment'])]
    private ?int $id = null;

    #[ORM\Column(length: 70)]
    #[Groups(['article', 'comment'])]
    private ?string $author = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['article', 'comment'])]
    private ?string $text = null;

    #[ORM\Column]
    #[Groups(['article', 'comment'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['article', 'comment'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(targetEntity: Article::class, inversedBy: 'comment')]
    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    private ?Article $article = null;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    #[Groups(['article', 'comment'])]
    private bool $isFlagged = false;

    #[ORM\Column(length: 20, options: ['default' => 'pending'])]
    #[Groups(['article', 'comment'])]
    private string $moderationStatus = 'pending'; // "pending", "approved", "rejected"

    #[ORM\PrePersist]
    public function setCreatedAt(): void
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(string $author): static
    {
        $this->author = $author;

        return $this;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): static
    {
        $this->text = $text;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getArticle(): ?Article
    {
        return $this->article;
    }

    public function setArticle(?Article $article): static
    {
        $this->article = $article;

        return $this;
    }

    public function isFlagged(): bool
    {
        return $this->isFlagged;
    }

    public function setIsFlagged(bool $isFlagged): static
    {
        $this->isFlagged = $isFlagged;

        return $this;
    }

    public function getModerationStatus(): string
    {
        return $this->moderationStatus;
    }

    public function setModerationStatus(string $moderationStatus): static
    {
        $this->moderationStatus = $moderationStatus;

        return $this;
    }
}
