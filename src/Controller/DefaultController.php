<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DefaultController extends AbstractController
{
    // Capturé tous ce qui suit /, '^(?!api).*$' = expression régulière pour capturer toutes les routes sauf api
    #[Route('/{any}', name: 'react_routes', requirements: ['any' => '^(?!api).*$'], methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('/index.html.twig');
    }
}
