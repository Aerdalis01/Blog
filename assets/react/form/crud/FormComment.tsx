import { useEffect, useState } from "react"
import { Article } from "../../components/models/articleInterface";
import {fetchArticle } from "../../services/articleServices";
import { Comment } from "../../components/models/commentInterface";
import { createComment, fetchComment, updateComment } from "../../services/commentServices";


interface FormCommentProps {
  articleId: number;
}

export function FormComment({ articleId }: FormCommentProps) {
  const [formData, setFormData] = useState<Comment>({
    id: 0,
    author: "",
    text: "",
    articleId: articleId

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
    if (!formData.author || !formData.text) {
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

      setFormData({ id: 0, author: "", text: "", articleId: 0 });
      setComment(await fetchComment());
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la soumission du commentaire.");
    }
  };




  return (
    <div className="form-group text-center">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="author">Auteur</label>
          <input
            className="form-control"
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Votre nom ou pseudo"
            required
          />
        </div>

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