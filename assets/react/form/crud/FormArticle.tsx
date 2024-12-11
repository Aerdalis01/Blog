import { useEffect, useState } from "react"
import { Article } from "../../components/models/articleInterface";
import { createArticle, updateArticle, deleteArticle, fetchArticles } from "../../services/articleServices";
import { Section } from "../../components/models/sectionInterface"
import { ImageService } from "../../services/imageServices";
import { fetchSection } from "../../services/sectionServices";


const imageService = new ImageService();

export function FormArticle() {
  const [formData, setFormData] = useState<Article>({
    id: 0,
    title: "",
    author: "",
    text: "",
    sectionId: 0,


  });
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleId, setArticleId] = useState<number | null>(
    null
  );
  const [sections, setSections] = useState<Section[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [sectionChangeMode, setSectionChangeMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const resetMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  //Load all sections 
  useEffect(() => {
    fetchArticles().then((articles) => {
      console.log("Articles fetched:", articles)
      setArticles(articles)
    })
      .catch(console.error);
    fetchSection().then(setSections).catch(console.error);
  }, []);


  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, sectionId: Number(e.target.value) });
  };
  const handleDelete = async (sectionId: number) => {
    if (!sectionId) {
      alert("Aucun ID de section fourni");
      return;
    }
    try {
      await deleteArticle(articleId); // Call sectionService for delete the section
      alert("Article supprimée avec succès");
      // Update list of section after delete
      setArticles(articles.filter((article) => article.id !== articleId));
      setArticleId(null);
    } catch (error: any) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression");
    }
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectArticleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value, 10);
    setArticleId(selectedId);
  
    // Trouvez l'article correspondant dans la liste des articles
    const selectedArticle = articles.find((article) => article.id === selectedId);
    if (selectedArticle) {
      setFormData({
        id: selectedArticle.id,
        title: selectedArticle.title,
        author: selectedArticle.author,
        text: selectedArticle.text,
        sectionId: selectedArticle.sectionId || 0, // Remplissez également la section
      });
      // Prévoyez un preview de l'image si elle existe
      if (selectedArticle.image) {
        setPreviewImage(selectedArticle.image.url); // Adaptez selon votre API
      }
    }
  };

  //Submit form for create or update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    if (!formData.title || !formData.author || !formData.text || !formData.sectionId) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    try {
      let imageId: string | null = null;
      if (file) {
        const uploadedImage = await imageService.uploadImage(file, "articles"); // Spécifiez le sous-dossier
        imageId = uploadedImage.id; // Récupérez l'ID de l'image
      }
      const articleData = {
        ...formData,
        image: imageId ? { id: Number(imageId) } : undefined,
      };
      console.log("Article Data:", articleData);
      if (articleId) {
        await updateArticle(articleId, articleData);
        setSuccessMessage("Article mis à jour !");
      } else {
        await createArticle(articleData);
        setSuccessMessage("Article créé !");
      }

      setFormData({ id: 0, title: "", author: "", text: "", sectionId: 0 });
      setFile(null);
      setPreviewImage(null);
      setArticles(await fetchArticles());
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la soumission de l'article.");
    }
  };




  return (
    <div className="form-group text-center">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column align-items-center">
          <label htmlFor="select-section">Sélectionner une section pour y créer un article :</label>
          <select id="select-section" onChange={handleSectionChange} value={formData.sectionId || ""}>
            <option value="" disabled>
              Sélectionner une section
            </option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex flex-column align-items-center">
          <label htmlFor="select-article">Sélectionner un article :</label>
          <select
            id="select-article"
            value={articleId || ""}
            onChange={handleSelectArticleChange}
          >
            <option value="" disabled>
              Sélectionner un article
            </option>
            {articles.map((article, index) => (
              <option key={article.id || index} value={article.id}>
                {article.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title">Titre</label>
          <input
            className="form-control"
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="author">Auteur</label>
          <input
            className="form-control"
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="text">Contenu</label>
          <textarea
            className="form-control"
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="my-3">Image</label>
          <input type="file" id="image" name="image" onChange={handleChange} accept="webp, Gif, jpeg" />
        </div>
        {previewImage && <img src={previewImage} alt="Prévisualisation" style={{ maxWidth: "50%" }} />}
        <div>
          <input
            type="checkbox"
            id="delete-mode"
            checked={deleteMode}
            onChange={() => setDeleteMode(!deleteMode)}
          />
          <label htmlFor="delete-mode">Activer la suppression</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="section-change-mode"
            checked={sectionChangeMode}
            onChange={() => setSectionChangeMode(!sectionChangeMode)}
          />
          <label htmlFor="delete-mode">Changer l'article de section</label>
        </div>
        {sectionChangeMode && (
          <div className="d-flex flex-column align-items-center">
            <label htmlFor="select-section">Sélectionner une nouvelle section :</label>
            <select
              id="select-section"
              value={formData.sectionId || ""}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  sectionId: parseInt(e.target.value, 10),
                }))
              }
            >
              <option value="" disabled>
                Sélectionner une section
              </option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit" className="btn btn-primary rounded-5">
          {deleteMode
            ? "Confirmer la suppression"
            : articleId
              ? "Mettre à jour"
              : "Créer"}
        </button>
      </form>
    </div>
  );
}