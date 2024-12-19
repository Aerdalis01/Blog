import React, { useState } from "react";
import { FormSection } from "../../form/crud/formSection";
import { FormArticle } from "../../form/crud/FormArticle";
import { CommentModerateReporting } from "../../form/CommentModeration";
import { FormFeaturedSections } from "../../form/FormFeaturedSection";

export const Content: React.FC<{ section: string }> = ({ section }) => {
  const [crudAction, setCrudAction] = useState<string>("");
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    setCrudAction(newValue);
  };
  const shouldShowHeader = !(
    section === "comment"
  );

  const renderForm = () => {
    switch (section) {
      case "section":
        switch (crudAction) {
          case "createOrEdit":
            return <FormSection />;
          case "featured":
            return <FormFeaturedSections />;
          default:
            return <p>Veuillez sélectionner une action pour les sections</p>;
        }
      case "article":
        switch (crudAction) {
          case "createOrEdit":
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
                ? "Sections"
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
                  <option value="createOrEdit">Créer / modifier / supprimer un(e) {section}</option>
                  {["section"].includes(section) && (
        <option value="featured">Choisissez les éléments à afficher sur la page principale</option>
      )}
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
