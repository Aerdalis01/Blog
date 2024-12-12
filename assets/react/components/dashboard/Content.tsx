import React, { useState } from "react";
import { FormSection } from "../../form/crud/formSection";
import { FormArticle } from "../../form/crud/FormArticle";
import { CommentModerateReporting } from "../../form/CommentModeration";

export const Content: React.FC<{ section: string }> = ({ section }) => {
  const [crudAction, setCrudAction] = useState<string>("");
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCrudAction(event.target.value);
  };
  const shouldShowHeader = !(
    section === "comment"
  );

  const renderForm = () => {
    switch (section) {
      case "section":
        switch (crudAction) {
          case "create or edit":
            return <FormSection />;
          default:
            return <p>Veuillez sélectionner une action pour les sections</p>;
        }
      case "article":
        switch (crudAction) {
          case "create or edit":
            return <FormArticle />;
          default:
            return <p>Veuillez sélectionner une action pour les articles</p>;

        }
      case "comment":
        return < CommentModerateReporting />;
      default:
        return <p>Veuillez sélectionner une action pour les articles</p>;
    }
  };

  return (

    <div className="dashboard-content content p-3 d-flex flex-column align-items-center text-center w-100">
      {section === "section" ||
        section === "article" ||
        section === "comment" ? (
        <>
          {shouldShowHeader && (
            <h2>
              Gestion des{" "}
              {section === "section"
                ? "Services"
                : section === "article"
                  ? "Articles"
                  : ""}
            </h2>
          )}
          {section !== "comment" &&
            (
              <div className="mb-3">
                <label htmlFor="crudSelect" className="form-label">
                  Sélectionnez une action :
                </label>
                <select
                  id="crudSelect"
                  className="form-select"
                  value={crudAction}
                  onChange={handleSelectChange}
                >
                  <option value="">Choisissez une action</option>
                  <option value="create or edit">Créer / modifier / supprimer un(e) {section}</option>

                </select>
              </div>
            )}
          <div className="mt-3">{renderForm()}</div>
        </>
      ) : (
        <h1>Bienvenue dans votre espace de travail</h1>
      )}
    </div>
  );
};
