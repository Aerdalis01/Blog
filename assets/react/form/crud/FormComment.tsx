import { useEffect, useState } from "react"
import { Article } from "../../components/models/articleInterface";
import {fetchArticle } from "../../services/articleServices";
import { Comment } from "../../components/models/commentInterface";
import { createComment, fetchComment, updateComment } from "../../services/commentServices";
import { fetchCurrentUser } from "../../services/userServices";


interface FormCommentProps {
  articleId: number;
}

export function FormComment({ articleId }: FormCommentProps) {
  const [user, setUser] = useState<{ id: number; pseudo: string } | null>(null);
  const [formData, setFormData] = useState<Comment>({
    id: 0,
    text: "",
    
    articleId: articleId,
    authorId: 0,
  });
  const [article, setArticle] = useState<Article | null>(null);
  const [comment, setComment] = useState<string | null>(null);
  const [commentId, setCommentId]  = useState<number |null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setUser(userData); // Stocker l'utilisateur
        setFormData((prev) => ({
          ...prev,
          authorId: userData.id, // Remplir l'ID utilisateur
          authorPseudo: userData.pseudo, // Remplir le pseudo utilisateur
        }));
      } catch (error) {
        console.error("Erreur lors du chargement de l'utilisateur :", error);
      }
    };

    loadUser();
  }, []);


  useEffect(() => {
    const loadArticle = async () => {
      try {
        const articleData = await fetchArticle(articleId);
        setArticle(articleData);
        setFormData((prev) => ({
          ...prev,
          articleId: articleData.id,
        }));
      } catch (error) {
        console.error("Erreur lors du chargement de l'article :", error);
      }
    };

    loadArticle();
  }, [articleId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

 
  //Submit form for create or update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    if (!formData.authorId || !formData.text) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    try {
      const commentData = {
        ...formData,
      };
      if (commentId) {
        await updateComment(commentId, commentData);
        setSuccessMessage("Commentaire mis à jour !");
      } else {
        await createComment(commentData);
        setSuccessMessage("Commentaire envoyé !");
      }

      setFormData({
        id: 0,
        text: "",
        articleId: articleId,
      
      });
      setComment(await fetchComment());
    } catch (err) {
      console.error(err);
      setError("Vous devez être connecté pour laissé un commentaire");
    }
  };




  return (
    <div className="form-group text-center">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="text">Commentaire</label>
          <textarea
            className="form-control"
            id="text"
            name="text"
            value={formData.text}
            placeholder="Votre commentaire"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary rounded-5">
          {commentId
              ? "Mettre à jour"
              : "Créer"}
        </button>
      </form>
    </div>
  );
}