import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserRoles } from "../../services/loginServices";



interface SidebarProps {
  onSectionChange: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSectionChange }) => {
  const [isClick, setIsClick] = useState(false);
  const [roles, setRoles] = useState<string[]>([])
  const hasRole = (roles: string[], roleToCheck: string): boolean => {
    return roles.includes(roleToCheck);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    const userRoles = getUserRoles();
    setRoles(userRoles);
  }, []);
  const isAdmin = hasRole(roles, 'ROLE_ADMIN');
  const isModerator = hasRole(roles, 'ROLE_MODERATOR');
  const toggleSidebar = () => {
    setIsClick(!isClick);
  };
  return (
    <div className="d-flex justify-content-center align-items-center">

      <section className="sidebar-Container d-flex h-100">
        <div className={`sidebar bg-primary text-center ${isClick ? "" : "d-none"}`}>
          <h3 className="text-warning" >Tableau de Bord</h3>
          <ul className="nav flex-column">
            {/* {userRoles.includes("ROLE_ADMIN") && ( */}
            <>
              <hr />
              <div className="accordion" id="accordionAdmin">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Espace Admin
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionAdmin"
                  >
                    <div className="accordion-body">
                      {isAdmin && (
                        <li className="nav-item">
                          <Link className="nav-link" to="#" onClick={() => onSectionChange("section")}>
                            Sections
                          </Link>
                        </li>
                      )}

                      {(isAdmin || isModerator) && (
                        <>
                          <li className="nav-item">
                            <Link className="nav-link" to="#" onClick={() => onSectionChange("article")}>
                              Articles
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" to="#" onClick={() => onSectionChange("comment")}>
                              Commentaires
                            </Link>
                          </li>
                        </>
                      )}

                      {isAdmin && (
                        <li className="nav-item">
                          <Link className="nav-link" to="#" onClick={() => onSectionChange("user")}>
                            Utilisateurs
                          </Link>
                        </li>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
            {/* )} */}

          </ul>
        </div>

      </section>
      <div className="d-flex bg-primary h-100 px-2">
        {/* Toggle Button for Sidebar */}
        <div
          className={`toggle-sidebar col-6 bg-primary text-warning d-flex justify-content-center align-items-center w-100 h-100`}
          onClick={toggleSidebar}
        >
          {isClick ? "❮" : "❯"}
        </div>
      </div>
    </div>
  );
};
