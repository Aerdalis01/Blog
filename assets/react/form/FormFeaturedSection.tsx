import { useEffect, useState } from "react";
import { fetchSection, updateSection } from "../services/sectionServices";
import { Section } from "../components/models/sectionInterface";

export function FormFeaturedSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [featuredSections, setFeaturedSections] = useState<number[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Charger les sections
  useEffect(() => {
    fetchSection()
      .then((data) => {
        setSections(data);
        const featured = data.filter((section: Section) => section.featured).map((section: Section) => section.id);
        setFeaturedSections(featured);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des sections :", error);
        setErrorMessage("Impossible de charger les sections.");
      });
  }, []);

  const handleCheckboxChange = (id: number) => {
    setFeaturedSections((prev) =>
      prev.includes(id) ? prev.filter((sectionId) => sectionId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Mettre à jour chaque section
      const updatePromises = sections.map((section) =>
        updateSection(section.id, {
          name: section.name,
          featured: featuredSections.includes(section.id),
         
        })
      );

      await Promise.all(updatePromises);

      setSuccessMessage("Sections mises à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setErrorMessage("Erreur lors de la mise à jour des sections.");
    }
  };

  return (
    <div>
      <h2>Sélectionner les sections à afficher sur la page d'accueil</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        {sections.map((section) => (
          <div key={section.id}>
            <input
              type="checkbox"
              id={`section-${section.id}`}
              checked={featuredSections.includes(section.id)}
              onChange={() => handleCheckboxChange(section.id)}
            />
            <label htmlFor={`section-${section.id}`}>{section.name}</label>
          </div>
        ))}

        <button type="submit" className="btn btn-primary mt-3">Enregistrer</button>
      </form>
    </div>
  );
}
