import { jwtDecode } from "jwt-decode";

export const fetchCurrentUser = async (): Promise<any> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token manquant');
    }
  
    const response = await fetch('/api/user/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération de l\'utilisateur');
    }
  
    return response.json();
  };

 export  const getUserRoles = (): string[] => {
    const token = localStorage.getItem("token");
    if (!token) return [];
    try {
      const decoded: { roles: string[] } = jwtDecode(token);
      return decoded.roles || [];
    } catch (err) {
      console.error("Erreur lors du décodage du token :", err);
      return [];
    }
  };