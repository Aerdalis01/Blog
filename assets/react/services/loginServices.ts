import jwt_decode, { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { setupAutoLogout } from './LogoutService';

const TOKEN_KEY = 'token';
const ROLES_KEY = 'roles';

const apiFetch = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Une erreur est survenue');
    }

    return response.json();
  } catch (err) {
    console.error(`Erreur réseau pour ${url}:`, err);
    throw err;
  }
};

export const login = async (
  email: string,
  password: string,
  navigate: Function
) => {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  try {
    const data = await apiFetch('/api/login', {
      method: 'POST',
      body: formData,
    });
    console.log('Connexion réussie ! Token JWT reçu:', data.token);

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(ROLES_KEY, JSON.stringify(data.roles));

    setupAutoLogout();
    navigate('/');
    return { success: true, token: data.token };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLES_KEY);
  console.log('Déconnexion réussie, token et rôles supprimés.');
};

export const getUserRoles = (): string[] => {
  const roles = localStorage.getItem(ROLES_KEY);
  return roles ? JSON.parse(roles) : [];
};

export const hasRole = (role: string): boolean => {
  const roles = getUserRoles();
  return roles.includes(role);
};

export interface DecodedToken {
  exp: number; // Timestamp UNIX de l'expiration
  [key: string]: any; // Autres propriétés du token
}

export const isTokenValid = (): boolean => {
  const token = getToken();

  if (!token) {
    return false; // Pas de token, utilisateur non connecté
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convertir en secondes
    return decoded.exp > currentTime; // Vérifier si le token a expiré
  } catch (err) {
    console.error('Erreur lors de la validation du token :', err);
    return false;
  }
};
