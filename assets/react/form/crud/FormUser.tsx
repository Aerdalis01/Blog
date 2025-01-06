import { useEffect, useState } from "react";
import { User } from "../../components/models/userInterface";

export function FormUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const availableRoles = ["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"];

  const resetMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      
    };
  };
  // Récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user",{
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des utilisateurs.");
      }
      const data = await response.json();
    setUsers(data.map((user: User) => ({ ...user, id: String(user.id), // Convertir l'id en chaîne
      roles: user.roles[0], // Optionnel : simplifier les rôles si c'est un tableau
    }))
  ); // Prenez le premier rôle si c'est un tableau
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
      setError("Impossible de charger les utilisateurs.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Mettre à jour le rôle d'un utilisateur
  const updateUserRole = async (id: number | string, newRole: string) => {
    if (!availableRoles.includes(newRole)) {
      setError("Rôle non valide.");
      return;
    }
  
    const bodyData = { roles: [newRole], 
      userId: id,
     }; // Les rôles doivent être un tableau

    console.log("Données envoyées :", bodyData); // Debug: Vérifiez le contenu
  
    try {
      const response = await fetch(`/api/user/${id}/edit`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ roles: [newRole],
          userId: id
         }), // Toujours envoyer un tableau
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour du rôle.");
      }

      setSuccessMessage("Rôle mis à jour avec succès !");
      fetchUsers(); // Rechargez la liste des utilisateurs
      setTimeout(() => {
        resetMessages();
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur lors de la mise à jour du rôle.");
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (id: number | string) => {
    try {
      const response = await fetch(`/api/user/${id}/delete`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur.");
      }

      setSuccessMessage("Utilisateur supprimé !");
      fetchUsers();
      setTimeout(() => {
        resetMessages();
      }, 3000);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression de l'utilisateur.");
    }
  };

  return (
    <div>
      <h2>Gestion des Utilisateurs</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <table className="table user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  <select
                      value={Array.isArray(user.roles) ? user.roles[0] : user.roles}  // Gérer les rôles multiples
                    onChange={(e) => {
                      const updatedRole = e.target.value;
                      setUsers((prev) =>
                        prev.map((u) =>
                          u.id === user.id ? { ...u, roles: [updatedRole] } : u
                        )
                      );
                    }}
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() =>
                      updateUserRole(user.id, Array.isArray(user.roles) ? user.roles[0] : user.roles)
                    }
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(user.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>Aucun utilisateur trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
