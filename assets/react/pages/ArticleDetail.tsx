
import React, { useEffect, useState } from 'react';
import { Article } from '../components/models/articleInterface';
import { FormComment } from '../form/crud/FormComment';
import Accordion from 'react-bootstrap/Accordion';
import { fetchCommentAndArticle, updateComment } from '../services/commentServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

interface ArticleDetailProps {
  articleId: number;
  onBack: (id: number) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({ articleId, onBack }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [updatedText, setUpdatedText] = useState<string>(''); // 

  const handleFlagComment = async (id: number) => {
    try {
      const response = await fetch(`/api/comment/${id}/flag`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Erreur lors du signalement du commentaire');
      }
      console.log('Commentaire signalé');

    } catch (err) {
      console.error(err);
    }
  };


  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>, commentId: number) => {
    e.preventDefault();
    try {
      await updateComment(editingCommentId, { text: updatedText });
      console.log('Commentaire mis à jour avec succès');
      setEditingCommentId(null);
      setUpdatedText('');
      const updatedComments = await fetchCommentAndArticle(articleId);
      setComments(updatedComments);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du commentaire', err);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setUpdatedText(comment.text); // Préremplir avec le texte actuel du commentaire
  };

  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await fetchCommentAndArticle(articleId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Erreur lors du chargement des commentaires :", error);
        setError("Erreur lors du chargement des commentaires.");
      }
    };

    loadComments();
  }, [articleId]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/article/${articleId}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération de l\'article');

        const data = await response.json();

        setArticle(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (loading) return <p>Chargement...</p>;

  if (!article) {
    return (
      <div>
        <p>Chargement ou section introuvable...</p>
        <button onClick={() => onBack(articleId)}>Retour à la section</button>
      </div>
    );
  }

  return (
    <section className="section-page container-fluid d-flex flex-column align-items-center justify-content-around text-center">
      <div >
        <h1 className='section-name'>{article.title}</h1>
        <button className="btn btn-secondary btn-onback mx-auto" onClick={() => onBack(articleId)}>
          Retour à la section
        </button>
        <div className='container-fluid w-100'>
          <div className='row row-cols-12'>
            <div className="card container-fluid article col-12">
              <div className="card-body">
                <div className="col d-flex align-items-center justify-content-center">
                  <div className="article-content d-flex flex-column align-item-center justify-content-center text-center">
                    <div className=" d-flex align-item-center justify-content-center">
                      {article.image ? (
                        <img
                          src={`/uploads/${article.image.url}`}
                          alt={article.image.name || 'Image'}
                          className="img-fluid mb-3 col-6"
                        />
                      ) : (
                        <p>Aucune image disponible</p>
                      )}
                    </div>
                    <article className="card-text text-dark">{article.text}</article>
                    <div className='d-flex flex-row justify-content-around'>
                      <p>Auteur : {article.author}</p>
                      <p>Créé le : {new Date(article.createdAt).toLocaleDateString()}</p>
                      {article.updatedAt && (
                        <p>Mis à jour le : {new Date(article.updatedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='comments-container'>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Voir commentaire</Accordion.Header>
                  <Accordion.Body>
                    <Accordion>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Ajouter un commentaire</Accordion.Header>
                        <Accordion.Body>
                          <div>
                            {article ? (
                              <div className='my-5'>
                                <h4>Commenter l'article</h4>
                                <FormComment articleId={article.id} />
                              </div>
                            ) : (
                              <p>Aucun article disponible</p>
                            )}
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                    <div className='comments-list container-fluid'>
                      <div className='row'>
                        <div className='col-12' >
                          {article.comment && article.comment.length > 0 ? (
                            article.comment.map((comment) => (
                              <div key={comment.id} className="comment card mb-3">
                                <div className="card-body card-comment d-flex flex-column align-items-center justify-content-center">
                                  {editingCommentId === comment.id ? (
                                    <form onSubmit={(e) => handleUpdateSubmit(e, comment.id)}>
                                      <textarea
                                        className="form-control"
                                        value={updatedText}
                                        onChange={(e) => setUpdatedText(e.target.value)}
                                        required
                                      />
                                      <button type="submit" className="btn btn-success mt-2">
                                        Enregistrer
                                      </button>
                                      <button
                                        type="button"
                                        className="btn btn-secondary mt-2"
                                        onClick={() => setEditingCommentId(null)}
                                      >
                                        Annuler
                                      </button>
                                    </form>
                                  ) : (
                                    <>
                                      <p className="card-text my-5">{comment.text}</p>
                                      <p className="card-subtitle text-muted">
                                        <em>- {comment.author || 'Anonyme'}</em>
                                      </p>
                                      <button
                                        className="btn btn-warning btn-moderation"
                                        onClick={() => handleFlagComment(comment.id)}
                                      >
                                        Signaler
                                      </button>
                                      <div className='d-flex'>
                                        <p className='mx-5'>Créé le : {new Date(comment.createdAt).toLocaleDateString()}</p>
                                        {comment.updatedAt && (
                                          <p className='mx-5'>Mis à jour le : {new Date(comment.updatedAt).toLocaleDateString()}</p>
                                        )}
                                        <FontAwesomeIcon
                                          className='mx-5'
                                          icon={faEdit}
                                          style={{ cursor: 'pointer', color: 'blue' }}
                                          onClick={() => handleEditComment(comment)}
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>Aucun commentaire disponible pour cet article.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};