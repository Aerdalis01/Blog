const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};
// Récupération des articles
export const fetchArticles = async () => {
  const res = await fetch('/api/article/');
  if (!res.ok) {
    throw new Error('Erreur lors du chargement des articles');
  }
  const data = await res.json();
  return data;
};
export const fetchArticle = async (articleId: number) => {
  const res = await fetch(`/api/article/${articleId}`);
  if (!res.ok) {
    throw new Error('Erreur lors du chargement de l\'article');
  }
  const data = await res.json();
  return data;
};

// Création d'un nouvel article
export const createArticle = async (articleData: {
  title: string;
  author: string;
  text: string;
  sectionId: number; 
  image?: File | { id: number }; // File pour une nouvelle image, { id } pour une image existante
}) => {
  const formData = new FormData();
  formData.append("title", articleData.title);
  formData.append("author", articleData.author);
  formData.append("text", articleData.text);
  formData.append("sectionId", articleData.sectionId.toString())
  // Ajout conditionnel de l'image
  if (articleData.image instanceof File) {
    formData.append("image", articleData.image); // Envoie un fichier brut
  } else if (articleData.image) {
    formData.append("imageId", articleData.image.id.toString()); // Envoie l'ID d'une image existante
  }

  const res = await fetch('/api/article/new', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la création de l\'article');
  }
  return res.json();
};

// Mise à jour d'un article existant
export const updateArticle = async (
  id: number,
  articleData: {
    title: string;
    author: string;
    text: string;
    sectionId: number; 
    image?: File | { id: number }; // File pour une nouvelle image, { id } pour une image existante
  }
) => {
  const formData = new FormData();
  formData.append("title", articleData.title);
  formData.append("author", articleData.author);
  formData.append("text", articleData.text);
  formData.append("sectionId", articleData.sectionId.toString());
  // Ajout conditionnel de l'image
  if (articleData.image instanceof File) {
    formData.append("imageId", articleData.image); // Envoie un fichier brut
  } else if (articleData.image) {
    formData.append("imageId", articleData.image.id.toString()); // Envoie l'ID d'une image existante
  }

  const res = await fetch(`/api/article/${id}/edit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la mise à jour de l\'article');
  }
  return res.json();
};

// Suppression d'un article
export const deleteArticle = async (articleId: number) => {
  const res = await fetch(`/api/article/delete/${articleId}`, { method: 'DELETE', headers: getAuthHeaders(), });
  if (!res.ok) {
    throw new Error('Erreur lors de la suppression de l\'article');
  }
};
