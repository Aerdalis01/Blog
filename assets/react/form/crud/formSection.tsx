import { useEffect, useState } from "react"
import { Section } from "../../components/models/sectionInterface"
import { createSection, deleteSection } from "../../services/sectionServices";
import { updateSection } from "../../services/sectionServices";

export function FormSection() {
  const [formData, setFormData] = useState<Section>({
    id: 0,
    name: '',
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
        console.log("Données récupérées :", data);
        setSections(data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des sections :", error);
      });
  }, []);


  useEffect(() => {
    // Charger les données de la section sélectionnée pour la mise à jour
    if (sectionId !== null) {
      fetch(`/api/section/${sectionId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors du chargement de la section.");
          }
          return response.json();
        })
        .then((data) => {
          setFormData({
            id: data.id || 0,
            name: data.name || "",
          });
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des données de la section :", error);
          setError("Impossible de charger la section sélectionnée.");
        });
    }
  }, [sectionId]);

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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
        ? await updateSection(formData.id, { name: formData.name }) // Update
        : await createSection(formData); // Create

      console.log("Réponse de l'API :", response);
      setSuccessMessage(sectionId ? "Section mise à jour avec succès !" : "Section créée avec succès !");
      setFormData({ id: 0, name: "" });
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="select-section">Sélectionner une section pour modifier ou supprimer :</label>
          <select id="select-section" onChange={handleSelectChange} value={sectionId || ""}>
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
        <div>
          <input
            type="checkbox"
            id="delete-mode"
            checked={deleteMode}
            onChange={() => setDeleteMode(!deleteMode)} // Activer/désactiver le mode suppression
          />
          <label htmlFor="delete-mode">Activer la suppression</label>
        </div>
        </div>
        <div>
          <label htmlFor="name">Nom de la section</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary rouded-5" type="submit">{deleteMode ? "Confirmer la suppression" : sectionId ? "Mettre à jour" : "Créer"}</button>
      </form>
    </div>
  );
}