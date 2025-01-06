import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { FormSection } from '../form/crud/formSection';
import { ArticleDetail } from './ArticleDetail';
import { fetchSectionId } from '../services/sectionServices';
import { Section } from '../components/models/sectionInterface';
import { Article } from '../components/models/articleInterface';
import { faDivide } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Image } from '../components/models/imageInterface';



export const HomePage = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [featuredSection, setFeaturedSection] = useState<Section[]>([]);
  const navigate = useNavigate();
  const [latestImage, setLatestImage] = useState(null);

  const handleArticleClick = (id: number) => {
    navigate(`/article/${id}`);
  }
  const truncaText = (text: string, maxLenght: number) => {
    if (text.length > maxLenght) {
      return text.substring(0 + maxLenght) + "...";
    }
    return text;
  }

  useEffect(() => {
    const fetchLatestImage = async () => {
      try {
        const response = await fetch('/api/images/latest-image');
        if (!response.ok) {
          throw new Error('Failed to fetch latest image');
        }
        const data = await response.json();
        if (data.length > 0) {
          setLatestImage(data); // Assurez-vous que c'est le premier élément
        } else {
          setLatestImage([]); // Pas d'image disponible
        }
      } catch (err) {
        console.error(err);
        setError(err.message); // Gérer l'erreur
      }
    };

    fetchLatestImage();
  }, []);

  useEffect(() => {
    const fetchFeaturedSections = async () => {
      try {
        const response = await fetch(`/api/section/featured`);
        if (!response.ok) {
          throw new Error('Failed to fetch featured sections');
        }
        const data = await response.json();

        // Trier les articles pour chaque section
        const sortedSections = data.map((section: Section) => ({
          ...section,
          articles: section.articles.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        }));

        // Mettre News en premier
        const newsSection = sortedSections.find((section: Section) => section.name === "News");
        const otherSections = sortedSections.filter((section: Section) => section.name !== "News");

        setFeaturedSection(newsSection ? [newsSection, ...otherSections] : sortedSections);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSections();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>Erreur : {error}</p>;
  }

  if (featuredSection.length === 0) {
    return <p>Aucune section à afficher.</p>;
  }

  return (
    <section className="home-page container-fluid row align-items-center justify-content-center mx-auto my-4">
      {/* Section News */}
      <div className="row px-2">
        {featuredSection.map((section) => {
          if (section.name === "News" && section.articles.length > 0) {
            const latestArticle = section.articles[0];
            return (
              <div key={section.id} className="news-section card col-12 mb-4 ">
                <div className="card-body row gx-3">
                  <div className='d-flex flex-column col-md-6 col-12 mb-3'>
                    <h1 className="card-title text-dark">Les News</h1>
                    <div className='d-flex flex-column align-items-center justify-content-center justify-content-center'>
                      <h2 className="text-dark">{truncaText(latestArticle.title, 100)}</h2>
                      <p className="card-text">{truncaText(latestArticle.text, 200)}</p>
                      <button onClick={() => handleArticleClick(latestArticle.id)} className="btn btn-primary">Lire la suite</button>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center col-md-6">
                    {latestArticle.image ? (
                      <img
                        src={`/uploads/${latestArticle.image.url}`}
                        alt={latestArticle.image.name || 'Image'}
                        className="img-fluid mb-3 col-9 col-md-6"
                      />
                    ) : (
                      <p>Aucune image disponible</p>
                    )}
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      {/* Autres sections en row */}
      <div className="row px-0 mb-4">
        {featuredSection.map((section) => {
          if (section.name !== "News" && section.articles.length > 0) {
            const latestArticle = section.articles[0];
            return (
              <div key={section.id} className="col-12 col-md-6  px-2">
                <div className="card standard-section h-100">
                  <div className="card-body">
                    <h2 className="card-title text-dark">{section.name}</h2>
                    <div className="d-flex align-items-center justify-content-center  col-12">
                      {latestArticle.image ? (
                        <img
                          src={`/uploads/${latestArticle.image.url}`}
                          alt={latestArticle.image.name || 'Image'}
                          className="img-fluid mb-3 col-6 col-md-3"
                        />
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <div className='d-flex flex-column align-items-center justify-content-center justify-content-center'>
                      <h4 className="text-dark">{truncaText(latestArticle.title, 100)}</h4>
                      <p className="card-text">{truncaText(latestArticle.text, 200)}</p>
                      <button onClick={() => handleArticleClick(latestArticle.id)} className="btn btn-primary">Lire la suite</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className='container-fluid'>
        <div className='row g-3'>
          {latestImage ? (
            latestImage.map((image: Image) => (
              <div key={image.id} className='col-12 col-md-6 col-lg-4'>
                
                  <div className='card'>
                    <div className='car-body d-flex align-items-center justify-content-center '>
                      <img
                        src={`/uploads/${image.url}`}
                        alt={image.name || 'Image'}
                        className="col-10"
                      />
                    </div>
                  </div>
                </div>
              
            ))
          ) : error ? (
            <p style={{ color: 'red' }}>Erreur : {error}</p>
          ) : (
            <p>Chargement des images...</p>
          )}
        </div>
      </div>
    </section>
  );
};