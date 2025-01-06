import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (formValues.password !== formValues.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/user/reset-password/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: formValues.password,
          confirmPassword: formValues.confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue.");
      }
      const data = await response.json();
      setSuccessMessage(data.message);
      setSuccessMessage("Votre mot de passe a été réinitialisé avec succès !");
      setFormValues({ password: "", confirmPassword: "" });

      
      if (data.redirectTo) {
        console.log("Redirection vers :", data.redirectTo);
        setTimeout(() => {
            navigate(data.redirectTo);
        }, 2000);
    } else {
        console.error("Aucune redirection fournie par le serveur.");
    }
    } catch (error: any) {
      console.error("Erreur:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="reset-password-container text-center">
      <h2 className="my-5">Réinitialisation de votre mot de passe</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <div className="form-group">
          <label htmlFor="password">Nouveau mot de passe</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formValues.password}
            onChange={handleChange}
            required
            className="form-control mb-3"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleChange}
            required
            className="form-control mb-3"
            disabled={loading}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
        </button>
      </form>
    </div>
  );
};