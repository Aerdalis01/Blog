import React, { useEffect, useState } from 'react';
import { Comment } from '../components/models/commentInterface';
import { deleteComment } from '../services/commentServices';
import { Filter } from 'bad-words';
import { getAuthHeaders } from '../services/sectionServices';

const filter = new Filter();

export function  CommentModerateReporting() {
  const [flaggedComments, setFlaggedComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const moderateComment = async (id, status) => {
    
    try {
      const response = await fetch(`/api/comment/${id}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la modération');
      }
      if (status === 'rejected') {
        // Supprimez le commentaire rejeté de l'état local
        setFlaggedComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== id)
        
        );
        await deleteComment(id);
      } else if (status === 'approved') {
       
        setFlaggedComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchFlaggedComments = async () => {
      try {
        const response = await fetch(`/api/comment/flagged`,{headers: getAuthHeaders(),});
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des commentaires signalés');
        }
        const data = await response.json();
        setFlaggedComments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFlaggedComments();
  }, []);


  if (loading) return <p>Chargement des statistiques...</p>;

  return (
    <div>
      <h2>Commentaire signalé</h2>
      <table className="table comment-table">
        <thead>
          <tr>
            <th>Auteur</th>
            <th>Commentaire</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {flaggedComments.length > 0 ? (
            flaggedComments.map((comment) => (
              <tr key={comment.id}>
                <td>{comment.authorId || "Anonyme"}</td>
                <td>{comment.text}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => moderateComment(comment.id, 'approved')}
                  >
                    Approuver
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => moderateComment(comment.id, 'rejected')}
                  >
                    Rejeter
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>Aucun commentaire signalé.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
