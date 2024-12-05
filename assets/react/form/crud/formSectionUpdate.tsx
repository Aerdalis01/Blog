import { useEffect, useState } from "react"
import { Section } from "../../components/interface/sectionInterface"
import { updateSection } from "../../services/sectionServices";


export function FormSectionUpdate() {
  const [sections, setSections] = useState<Section[]>([]);
  const [formData, setFormData] = useState <Section>({
    id: 0,
    name: '',
  });
  const [sectionId, setSectionId] =  useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const resetForm = () => {
    setError(null);
    setSuccessMessage(null);
  };

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
    if (sectionId !== null) {
      fetch(`/api/section/${sectionId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors du chargement des services");
          }
          return response.json();
        })
        .then((data) => {

          setFormData({
            id: data.id || 0,
            name: data.nom || "",
          });
        })
        .catch((error) => {
          console.error(
            "Erreur lors du chargement des données de la section:",
            error
          );
        });
    }
  }, [sectionId]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setSectionId(selectedId);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await updateSection(formData.id, { name: formData.name });
      console.log("Réponse de l'API :", response);
      setSuccessMessage("Section créée avec succès !");
      resetForm();
      setFormData({ id: 0, name: '' });
    } catch (err: any) {
      console.error("Erreur :", err);
      setError(err.message || "Erreur inconnue lors de la création de la section");
    }
  };

  return (
    <div>
    {error && <p style={{ color: "red" }}>{error}</p>}
    {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    <form onSubmit={handleSubmit}>
    <select onChange={handleSelectChange} defaultValue="">
        <option value="" disabled>
          Sélectionner une section
        </option>
        {sections.map((section: any) => (
          <option key={section.id} value={section.id}>
            {section.name}
          </option>
        ))}
         </select>
      <div>
        <label htmlFor="name">Nom de la section</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Modifier</button>
    </form>
  </div>
);
}