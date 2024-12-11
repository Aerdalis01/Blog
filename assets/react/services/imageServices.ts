export class ImageService {

  

  /**
   * Upload une nouvelle image.
   * 
   * @param file Le fichier à uploader.
   * @param subDirectory Le sous-répertoire (facultatif).
   * @returns Les données de l'image créée.
   */

  async uploadImage(file: File, subDirectory: string = ''): Promise<any> {
    const formData = new FormData();
    formData.append('image', file);
    if (subDirectory) {
      formData.append('subDirectory', subDirectory);
    }
    const response = await fetch(`/api/images/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de l\'image');
    }

    return await response.json();
  }

  /**
   * Met à jour une image existante.
   * 
   * @param imageId L'ID de l'image à mettre à jour.
   * @param file Le nouveau fichier à uploader.
   * @param subDirectory Le sous-répertoire (facultatif).
   * @returns Les données de l'image mise à jour.
   */
  async updateImage(imageId: number, file: File, subDirectory: string = ''): Promise<any> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('subDirectory', subDirectory);

    const response = await fetch(`/api/images/${imageId}/update`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de l\'image');
    }

    return await response.json();
  }

  /**
   * Supprime une image existante.
   * 
   * @param imageId L'ID de l'image à supprimer.
   * @returns Une confirmation de suppression.
   */
  async deleteImage(imageId: number): Promise<void> {
    const response = await fetch(`api/images/${imageId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'image');
    }
  }
}