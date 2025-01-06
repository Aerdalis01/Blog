import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const RegisterPage: React.FC = () => {
  const [formValues, setFormValues] = useState<{ email: string; password: string; confirmPassword: string }>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // Gérer les changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setFormError(null);
    setSuccessMessage(null);

    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {};

    // Validation des champs
    if (!formValues.email) newErrors.email = "L'email est obligatoire.";
    if (!formValues.password) newErrors.password = "Le mot de passe est obligatoire.";
    if (formValues.password !== formValues.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", formValues.email);
      formData.append("password", formValues.password);

      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue.");
      }

      setSuccessMessage("Inscription réussie ! Redirection vers la page de connexion...");
      setTimeout(() => navigate("/login"), 3000); // Redirige après 3 secondes
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  return (
    <div className="register-page text-center">
      <h1>Inscription</h1>
      {formError && <p style={{ color: "red" }}>{formError}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit} className="container-fluid">
        <div className="col d-flex flex-column align-items-center justify-content-center text-center">
          <div className="mb-3">
            <label className="form-label col-10" htmlFor="email">Email :</label>
            <input
              className="form-control"
              type="email"
              id="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="email@email.com"
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label col-10" htmlFor="password">Mot de passe :</label>
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="Votre mot de passe"
            />
            {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label col-10" htmlFor="confirmPassword">Confirmez le mot de passe :</label>
            <input
              className="form-control"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmez votre mot de passe"
            />
            {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}
          </div>
          <button className="btn btn-primary mt-3" type="submit">S'inscrire</button>
          <div className="mt-3">
            <Link to="/resetPassword" className="nav-link">Mot de passe oublié?</Link>
          </div>
        </div>
      </form>
    </div>
  );
};
