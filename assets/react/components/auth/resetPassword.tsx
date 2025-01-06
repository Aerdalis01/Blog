import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

export const ResetPassword: React.FC = () => {
  const[formValues, setFormValues] = useState< {email: string}>({
    email :"",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value})
  };
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setSuccessMessage(null);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formValues.email)) {
        setError("Veuillez entrer une adresse email valide.");
        return;
      }
      try {
        setLoading(true);
        const response = await fetch("/api/user/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formValues.email }),
        });
        
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Réponse inattendue du serveur.");
        }

        const data = await response.json(); // Traitez le JSON uniquement si la réponse est correcte
        console.log("Succès:", data.message);

        setSuccessMessage("Un email a été envoyé pour réinitialiser votre mot de passe.");
        setTimeout(() => {
            navigate("/reset-password/success");
        }, 2000);
    } catch (error: any) {
        console.error("Erreur:", error.message);
        setError(error.message || "Une erreur est survenue.");
    } finally {
        setLoading(false);
    }
};
  
    return (
      <div className="forgot-password-container text-center col d-flex flex-column align-items-center justify-content-start text-center">
        <h2 className="my-5">Mot de passe oublié</h2>
        <form onSubmit={handleSubmit} className="forgot-password-form ">
          <div className="form-group ">
            <label htmlFor="email form-label">Adresse Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formValues.email}
              onChange={handleChange}
              required
              className="form-control mb-3"
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>
      </div>
    );
  };
