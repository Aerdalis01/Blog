
import React, { useEffect, useState } from 'react';
import { fetchArticles } from '../services/articleServices';
import { Article } from '../components/models/articleInterface';
import { Section } from '../components/models/sectionInterface';
import { fetchSection } from '../services/sectionServices';
import { ArticleDetail } from './ArticleDetail';

interface SectionDetailProps {
  sectionId: number;
  onBack: (id: number) => void;
}

export const SectionDetail: React.FC<SectionDetailProps> = ({ sectionId, onBack }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [articleId, setArticleId] = useState<number | null>(null);
  const [section, setSection] = useState<Section | null>(null);

const handleArticleClick = (id: number) => {
  setArticleId(id);
  console.log("article cliqué:", id)
}

  const truncaText = (text:string, maxLenght: number) => {
    if (text.length > maxLenght) {
      return text.substring(0 + maxLenght) + "..." ;
    }
    return text;
  }
  const handleBackToSection = () => {
    setArticleId(null);
  };
  useEffect(() => {
    fetchSection()
      .then((sections) => {
        const foundSection = sections.find((s: Section) => s.id === sectionId);
        setSection(foundSection ?? null);
      })
      .catch(console.error);
  }, [sectionId]);


  if (!section || !section.articles) {
    return (
      <div>
        <p>Chargement ou section introuvable...</p>
        <button onClick={() => onBack(sectionId)}>Retour</button>
      </div>
    );
  }
  if (articleId) {
    return <ArticleDetail articleId={articleId} onBack={handleBackToSection} />;
  }
  return (
    <section className="section-page container-fluid d-flex flex-column align-items-center justify-content-around text-center">
      <div >
        <h1 className='section-name'>{section.name}</h1>
        <button className="btn btn-secondary btn-onback mx-auto" onClick={() => onBack(sectionId)}>
          Retour aux sections
        </button>
        <div className='container-fluid w-100'>
          <div className='row row-cols-12'>
            {section.articles.length > 0 ? (
              section.articles.map((article) => (
                <div key={article.id} onClick={() => handleArticleClick(article.id)} style={{ cursor: 'pointer' }} className="card container-fluid article col-12 d-flex flex-column justify-content-center align-items-center">
                  <div className="card-body">
                    <div className="">
                      <div className="article-content d-md-flex">
                        <img src={`/uploads/${article.image.url}`} alt={article.image.name || 'Image'} className="img-fluid col-6 col-sm-4 col-md-1" />
                        <div className='d-flex flex-column justify-content-center align-items-center w-100 '>
                        <h3 className="card-title text-dark">{article.title}</h3>
                        <article className="card-text text-dark">{truncaText(article.text, 100)}</article>
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