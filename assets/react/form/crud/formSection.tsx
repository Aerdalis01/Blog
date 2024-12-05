import { useState } from "react"
import { Section } from "../../components/interface/sectionInterface"
import { createSection } from "../../services/sectionServices";


export function FormSection() {
  const [formData, setFormData] = useState <Section>({
    id: 0,
    name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const resetForm = () => {
    setError(null);
    setSuccessMessage(null);
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
      const response = await createSection(formData);
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
      <button type="submit">Créer</button>
    </form>
  </div>
);
}