<?php

namespace App\Service;

class CommentFilterService
{
    private string $nodeScriptPath;

    public function __construct()
    {
        $this->nodeScriptPath = __DIR__.'/../../assets/scripts/filter.mjs';
    }

    public function filter(string $text): string
    {
        $escapedText = escapeshellarg($text);
        $command = "node {$this->nodeScriptPath} {$escapedText}";
        $output = [];
        $returnVar = 0;

        exec($command, $output, $returnVar);

        if ($returnVar !== 0) {
            // Ajouter des informations de débogage
            $errorMessage = sprintf(
                "Erreur lors de l’exécution du filtre.\nCommande : %s\nSortie : %s\nCode de retour : %d",
                $command,                 // La commande exécutée
                implode("\n", $output),   // La sortie ou l'erreur retournée par la commande
                $returnVar                // Code de retour de la commande
            );

            // Afficher ou logger l'erreur pour l'analyse
            throw new \RuntimeException($errorMessage);
        }

        // Retournez la première ligne de la sortie ou le texte brut
        return $output[0] ?? $text;
    }
}
