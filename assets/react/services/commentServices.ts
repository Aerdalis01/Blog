import { FormSection } from "../form/crud/formSection";


export const fetchComment = async () => {
  const res = await fetch('/api/comment/');
  if (!res.ok) {
    throw new Error('Erreur lors du chargement des sections');
  }
  const data = await res.json();
  return data;
};
export const fetchCommentAndArticle = async (articleId: number) => {
  const res = await fetch(`/api/comment?articleId=${articleId}`);
  if (!res.ok) {
    throw new Error('Erreur lors du chargement des commentaires');
  }
  const data = await res.json();
  return data;
};
export const createComment = async (commentData) => {
  const formData = new FormData();
  formData.append("author", commentData.author);
  formData.append("text", commentData.text);
  formData.append("articleId", commentData.articleId.toString());
  
  const res = await fetch('/api/comment/new', {
    method: 'POST',
    body: formData, 
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la création du commentaire');
  }
  return res.json();
};

export const updateComment= async (id: number, commentData: {  text: string } ) => {
  const formData = new FormData();
  formData.append("text", commentData.text);
  const res = await fetch(`/api/comment/${id}/edit`, {
    method: 'POST',  
    body: formData, 
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la mise à jour de la race');
  }
  return res.json();
};

export const deleteComment = async (commentId: number) => {
  const res = await fetch(`/api/section/delete/${commentId}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error('Erreur lors de la suppression de la race');
  }
};