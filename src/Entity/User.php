<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\HasLifecycleCallbacks]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user', 'article', 'comment'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'L\'email est obligatoire.')]
    #[Assert\Email(message: 'L\'email n\'est pas valide.')]
    #[Groups(['user'])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le mot de passe est obligatoire.')]
    #[Assert\Length(
        min: 6,
        minMessage: 'Le mot de passe doit contenir au moins 6 caractères.'
    )]
    #[Groups(['user'])]
    private ?string $password = null;

    #[ORM\Column(type: 'json')]
    #[Groups(['user'])]
    private array $roles = [];

    #[ORM\Column(length: 50, unique: true)]
    #[Groups(['comment', 'article', 'user'])]
    private ?string $pseudo = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist'])]
    private ?Token $jwtToken = null;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist'])]
    private ?ResetPasswordToken $resetPasswordToken = null;

    #[ORM\OneToMany(mappedBy: 'author', targetEntity: Comment::class, cascade: ['persist', 'remove'])]
    #[Groups(['user'])]
    private Collection $comments;

    #[ORM\PrePersist]
    public function prePersist()
    {
        $this->setCreatedAt(new \DateTimeImmutable());
        $this->setUpdatedAt(new \DateTimeImmutable());
    }

    #[ORM\PreUpdate]
    public function preUpdate()
    {
        $this->setUpdatedAt(new \DateTimeImmutable());
    }

    public function __construct()
    {
        $this->comments = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getSalt(): ?string
    {
        return null;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
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

    public function eraseCredentials(): void
    {
    }

    public function getJwtToken(): ?Token
    {
        return $this->jwtToken;
    }

    public function setJwtToken(?Token $jwtToken): static
    {
        if ($this->jwtToken !== null && $this->jwtToken->getUser() === $this) {
            $this->jwtToken->setUser(null);
        }
        if ($jwtToken !== null && $jwtToken->getUser() !== $this) {
            $jwtToken->setUser($this);
        }
        $this->jwtToken = $jwtToken;

        return $this;
    }

    public function getResetPasswordToken(): ?ResetPasswordToken
    {
        return $this->resetPasswordToken;
    }

    public function setResetPasswordToken(?ResetPasswordToken $resetPasswordToken): static
    {
        if ($this->resetPasswordToken !== null && $this->resetPasswordToken->getUser() === $this) {
            $this->resetPasswordToken->setUser(null);
        }
        if ($resetPasswordToken !== null && $resetPasswordToken->getUser() !== $this) {
            $resetPasswordToken->setUser($this);
        }
        $this->resetPasswordToken = $resetPasswordToken;

        return $this;
    }

    public function getPseudo(): ?string
    {
        return $this->pseudo ?? 'User-'.$this->id;
    }

    public function setPseudo(string $pseudo): self
    {
        $this->pseudo = $pseudo;

        return $this;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments[] = $comment;
            $comment->setAuthor($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->removeElement($comment) && $comment->getAuthor() === $this) {
            $comment->setAuthor(null);
        }

        return $this;
    }
}
