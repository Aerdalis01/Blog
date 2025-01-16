import { useNavigate } from 'react-router-dom';
import { DecodedToken, getToken, logout } from './loginServices';
import { jwtDecode } from 'jwt-decode';

export const handleLogout = async (navigate: Function) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Aucun token trouvé.');
    return;
  }

  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Vérifiez si la réponse est en JSON ou brute
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const responseData = await response.json();
      if (response.ok) {
        console.log('Déconnexion réussie :', responseData.message);
      } else {
        console.error(
          'Erreur lors de la déconnexion :',
          responseData.error || 'Erreur inconnue.'
        );
        alert(
          responseData.error ||
            'Erreur lors de la déconnexion. Veuillez réessayer.'
        );
        return;
      }
    } else {
      // Si la réponse n'est pas en JSON, affichez un message d'erreur générique
      console.error("Réponse inattendue de l'API.");
      alert('Une erreur inattendue est survenue. Veuillez réessayer.');
      return;
    }
  } catch (error) {
    console.error('Erreur lors de la requête de déconnexion :', error);
    alert('Erreur réseau. Veuillez vérifier votre connexion.');
    return;
  } finally {
    // Toujours supprimer le token et rediriger
    localStorage.removeItem('token');
    navigate('/');
  }
};

export const setupAutoLogout = () => {
  const token = getToken();

  if (!token) return;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convertir en secondes
    const timeUntilExpiration = (decoded.exp - currentTime) * 1000; // En millisecondes

    if (timeUntilExpiration > 0) {
      setTimeout(() => {
        logout(); // Déconnecter l'utilisateur
        alert('Votre session a expiré. Veuillez vous reconnecter.');
        window.location.href = '/login'; // Rediriger vers la page de connexion
      }, timeUntilExpiration);
    }
  } catch (err) {
    console.error(
      'Erreur lors de la configuration de la déconnexion automatique :',
      err
    );
  }
};
