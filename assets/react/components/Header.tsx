
import { Link, useNavigate } from "react-router-dom";
import { fetchSection, fetchSectionId } from '../services/sectionServices';
import { Section } from '../components/models/sectionInterface';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { handleLogout } from "../services/LogoutService";
import { getUserRoles, isTokenValid } from "../services/loginServices"; 

export const Header: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHide, setShowHide] = useState(false);
  const navigate = useNavigate();
  const [roles, setRoles] = useState<string[]>([])
  const hasRole = (roles: string[], roleToCheck: string): boolean => {
    return roles.includes(roleToCheck);
  };
  useEffect(() => {
    setIsConnected(isTokenValid());
  }, []);

  const onLogout = () => {
    handleLogout(navigate); // Passer `navigate` à la fonction
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsConnected(!!token);
    setShowHide(!!token);

    const userRoles = getUserRoles();
    setRoles(userRoles);
  }, []);
  const isAdmin = hasRole(roles, 'ROLE_ADMIN');
  const isModerator = hasRole(roles, 'ROLE_MODERATOR');
  

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
            {!isConnected ? (
              <>
                {/* Connexion */}
                <li className="nav-item d-md-none">
                  <Link to="/login" className="nav-link px-2">
                    <FontAwesomeIcon
                      icon={faUser}
                      style={{ fontSize: "1.5rem", color: "#000" }}
                    />
                  </Link>
                </li>

                <li className="nav-item d-none d-md-block">
                  <Link
                    to="/login"
                    className="nav-link link-body-emphasis px-2"
                  >
                    Connexion / Inscription
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Déconnexion */}
                <li className="nav-item d-none d-md-block">
                  <Link
                    to="/"
                    onClick={onLogout}
                    className="nav-link link-body-emphasis px-2"
                  >
                    Déconnexion
                  </Link>
                </li>
                <li className="nav-item d-md-none">
                  <button
                    onClick={onLogout}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#000",
                    }}
                    title="Se déconnecter"
                  >
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      style={{ fontSize: "1.5rem" }}
                    />
                  </button>
                </li>
              </>
            )}
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
              <Link to="/galerie" className="nav-link link-body-emphasis px-2">
                Galerie
              </Link>
            </li>
            <li className="nav-item">
            {isConnected && (isAdmin || isModerator) && ( 
                <Link to="/dashboard" className="nav-link link-body-emphasis px-2">
                  Espace Admin
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};