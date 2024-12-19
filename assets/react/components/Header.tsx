
import { Link, useNavigate } from "react-router-dom";
import { fetchSection, fetchSectionId } from '../services/sectionServices';
import { Section } from '../components/models/sectionInterface';
import { SectionDetail } from '../pages/SectionDetail';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export const Header: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  



  useEffect(() => {
    const loadSection = async () => {
      try {
        const data = await fetchSection();
        setSections(data);
      } catch (err) {
        setError('Erreur lors de la récupération de la section.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSection();
  }, []);

  const handleSectionClick = (id: number) => {
    navigate(`/section/${id}`);
  };

 
  const handleBack = () => {
    setSelectedSectionId(null);
  };

  
 
  if (loading) return <p>Chargement des sections...</p>;
  if (error) return <p>{error}</p>;

  return (

    <div>
      {/* Header principal */}
      <header className="border-bottom header">
        <div className="d-flex flex-wrap justify-content-center text-center">
          <Link
            to="/"
            className="d-flex align-items-center mb-3 ms-2 me-auto me-md-0 link-body-emphasis text-decoration-none text-center"
          >
            <span className="fs-4">Les News</span>
          </Link>

          <ul className="nav nav-connexion">
            {/* Icône de connexion pour mobile */}
            <li className="nav-item d-md-none">
              <Link to="/login" className="nav-link px-2">
                <FontAwesomeIcon icon={faUser} style={{ fontSize: "1.5rem", color: "#000" }} />
              </Link>
            </li>
            {/* Texte pour desktop */}
            <li className="nav-item d-none d-md-block">
              <Link to="/login" className="nav-link link-body-emphasis px-2">
                Connexion /Inscription
              </Link>
            </li>
          </ul>
        </div>
      </header>

      {/* Navigation */}
      <nav className=" bg-body-tertiary border-bottom  ">
        <div className="container d-flex  justify-content-center align-items-center">
          <ul className="nav mx-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link link-body-emphasis px-2 active" aria-current="page">
                Accueil
              </Link>
            </li>
            {sections.map((section) => (
              <li key={section.id} className="nav-item d-flex align-items-center justify-content-center">
                <button
                onClick={() => handleSectionClick(section.id)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                {section.name}
              </button>
              </li>
            ))}
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link link-body-emphasis px-2">
                Espace Admin
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link link-body-emphasis px-2">
                À propos
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};