
import { useEffect, useState } from 'react';

import { Image } from '../components/models/imageInterface';



export const GaleriePage = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images/', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des images.');
        }

        const data = await response.json();
        setImages(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);
  const IMAGE_BASE_URL = '/uploads/';
  return (

    <section id='section' className="Image-page container-fluid d-flex flex-column align-items-center justify-content-around">
      <div className='row g-4'>
        {loading && <p>Chargement des images...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && images.length === 0 && <p>Aucune image trouvée.</p>}

        {images.map((image) => (
          image.url ? (
            <div className='col-12 col-md-6'>
            <div key={image.id} className='card article'>
              <div className='card-body'>
                <div className="col d-flex align-items-center justify-content-center">
                  <div className="article-content text-center">
                    <img src={`/uploads/${image.url}`} alt={image.name || 'Image'} className="img-fluid" />
                  </div>
                </div>
              </div>
            </div>
            </div>
          ) : (
            <p key={image.id}>URL d'image introuvable</p>

          )
        ))}
      </div>
    </section >
  );

}