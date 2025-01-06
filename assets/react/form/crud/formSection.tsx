import { useEffect, useState } from "react"
import { Section } from "../../components/models/sectionInterface"
import { createSection, deleteSection } from "../../services/sectionServices";
import { updateSection } from "../../services/sectionServices";

export function FormSection() {
  const [formData, setFormData] = useState<Section>({
    id: 0,
    name: '',
    featured: false,
  });
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionId, setSectionId] = useState<number | null>(
    null
  );
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset success and error message
  const resetMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  //Load all sections 
  useEffect(() => {
    fetch("/api/section")
      .then((response) => response.json())
      .then((data) => {
        setSections(data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des sections :", error);
      });
  }, []);


  useEffect(() => {
    if (sectionId !== null) {
      const selectedSection = sections.find((section) => section.id === sectionId);
      if (selectedSection) {
        setFormData(selectedSection);
      }
    } else {
      setFormData({ id: 0, name: "", featured: false });
    }
  }, [sectionId, sections]);


  const handleDelete = async (sectionId: number) => {
    if (!sectionId) {
      alert("Aucun ID de section fourni");
      return;
    }
    try {
      await deleteSection(sectionId); // Call sectionService for delete the section
      alert("Section supprimée avec succès");
      // Update list of section after delete
      setSections(sections.filter((section) => section.id !== sectionId));
      setSectionId(null); // Reset the selection
    } catch (error: any) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression");
    }
  };

  //Handle selection change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setSectionId(selectedId);
  };

  //Handle changes into the form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Caster e.target en HTMLInputElement pour les checkboxes
    const isChecked = (e.target as HTMLInputElement).checked;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? isChecked : value,
    }));
  };

  //Submit form for create or update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();

    if (deleteMode) {
      handleDelete(sectionId!); // Call the function 
      return;
    }
    try {
      const response = sectionId
        ? await updateSection(formData.id, { name: formData.name, featured: formData.featured}) // Update
        : await createSection(formData); // Create

      console.log("Réponse de l'API :", response);
      setSuccessMessage(sectionId ? "Section mise à jour avec succès !" : "Section créée avec succès !");
      setFormData({ id: 0, name: "", featured: false });
      setSectionId(null);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);


      //Reload sections after creation or update
      fetch("/api/section")
        .then((response) => response.json())
        .then((data) => setSections(data));
    } catch (err: any) {
      console.error("Erreur :", err);
      setError(err.message || "Erreur inconnue lors de la soumission du formulaire.");
    }
  };

  return (
    <div>
      <h2>Gérer les Sections</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form key={formData.id} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="select-section">Sélectionner une section :</label>
          <select
            id="select-section"
            onChange={(e) => setSectionId(Number(e.target.value))}
            value={sectionId || ""}
          >
            <option value="" disabled>
              Sélectionner une section
            </option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name">Nom de la section :</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>


        <div>
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
          />
          <label htmlFor="featured">
            {formData.featured
              ? "Décochez pour retirer de la page principale"
              : "Cochez pour ajouter à la page principale"}
          </label>
        </div>

        <div>
          <input
            type="checkbox"
            id="delete-mode"
            checked={deleteMode}
            onChange={() => setDeleteMode(!deleteMode)}
          />
          <label htmlFor="delete-mode">Activer le mode suppression</label>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          {deleteMode ? "Confirmer la suppression" : sectionId ? "Mettre à jour" : "Créer"}
        </button>
      </form>
    </div>
  );
}