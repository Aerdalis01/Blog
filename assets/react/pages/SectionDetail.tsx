
import React, { useEffect, useState } from 'react';

import { Article } from '../components/models/articleInterface';
import { Section } from '../components/models/sectionInterface';
import { fetchSection, fetchSectionId } from '../services/sectionServices';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from "react-router-dom";


// interface SectionDetailProps {
//   sectionId: number;
//   onBack: (id: number) => void;
// }
export const SectionDetail: React.FC = () => {
  const [section, setSection] = useState<Section | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleId, setArticleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();

const handleArticleClick = (id: number) => {
  navigate(`/article/${id}`);
}

  const truncaText = (text:string, maxLenght: number) => {
    if (text.length > maxLenght) {
      return text.substring(0, maxLenght ) + "..." ;
    }
    return text;
  }
  const handleBackToSection = () => {
    setArticleId(null);
  };

  useEffect(() => {
    const loadSection = async () => {
      try {

        if (!sectionId) throw new Error("sectionId non défini.");
        const id = parseInt(sectionId, 10);
        if (isNaN(id)) throw new Error("L'ID de la section n'est pas un nombre valide.");
        console.log("ID de la section :", id);
        console.log(`URL appelée : /api/section/${id}`);
        const data = await fetchSectionId(id);
        setSection(data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération de la section.");
      } finally {
        setLoading(false);
      }
    };

    loadSection();
  }, [sectionId]);


  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!section) return <p>Section introuvable.</p>;
  return (
    <section className="section-page container-fluid d-flex flex-column align-items-center  text-center">
       <button className="btn btn-secondary btn-onback mx-auto mt-3" onClick={() => navigate(-1)}>Retour</button>
      <div className=''>
        <h1 className='section-name my-5'>{section.name}</h1>
        <div className='container-fluid w-100'>
          <div className='row row-cols-12'>
            {section.articles.length > 0 ? (
              section.articles.map((article) => (
                <div key={article.id} onClick={() => handleArticleClick(article.id)} style={{ cursor: 'pointer' }} className="card container-fluid article col-12 d-flex flex-column justify-content-center align-items-center my-1">
                  <div className="card-body">
                    <div className="">
                      <div className="article-content d-md-flex align-items-center justify-content-center">
                        <img src={`/uploads/${article.image.url}`} alt={article.image.name || 'Image'} className="img-fluid col-6 col-sm-4 col-md-1" />
                        <div className='d-flex flex-column justify-content-center align-items-center w-100 '>
                        <h3 className="card-title text-dark w-100">{article.title}</h3>
                        <article className="card-text text-dark w-100">{truncaText(article.text, 75)}</article>
                        </div>
                        <p className='mb-0 mt-3'>Auteur : {article.author}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Aucun article disponible pour cette section.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};