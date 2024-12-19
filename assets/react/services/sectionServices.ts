import { FormSection } from "../form/crud/formSection";


export const fetchSection = async () => {
  const res = await fetch('/api/section/');
  if (!res.ok) {
    throw new Error('Erreur lors du chargement des sections');
  }
  const data = await res.json();
  return data;
};
export const fetchSectionId = async (id: number ) => {
  const res = await fetch(`/api/section/${id}`);
  if (!res.ok) {
    throw new Error('Erreur lors du chargement de la section');
  }
  const data = await res.json();
  return data;
};

export const createSection = async (sectionData) => {
  const formData = new FormData();
  formData.append("name", sectionData.name);
  
  const res = await fetch('/api/section/new', {
    method: 'POST',
    body: formData, 
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la création de la section');
  }
  return res.json();
};

export const updateSection = async (id: number, sectionData: { name: string, featured: boolean } ) => {
  const formData = new FormData();
  formData.append("name", sectionData.name);
  formData.append("featured", sectionData.featured.toString()); 
  const res = await fetch(`/api/section/${id}/edit`, {
    method: 'POST',  
    body: formData, 
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la mise à jour de la race');
  }
  return res.json();
};

export const deleteSection = async (sectionId: number) => {
  const res = await fetch(`/api/section/delete/${sectionId}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error('Erreur lors de la suppression de la race');
  }
};