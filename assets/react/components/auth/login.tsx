import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/loginServices";

export const LoginPage: React.FC = () => {
  const [formValues, setFormValues] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | undefined>();
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
    setSuccessMessage(null);
    setFormError(undefined);

    // Validation simple
    const newErrors: { email?: string; password?: string } = {};
    if (!formValues.email) {
      newErrors.email = "L'email est obligatoire.";
    }
    if (!formValues.password) {
      newErrors.password = "Le mot de passe est obligatoire.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await login(formValues.email, formValues.password, navigate);

      if (result.success) {
        setSuccessMessage("Connexion réussie !");
        console.log("Token JWT :", result.token);
       
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  return (
    <div className="login-page text-center">
      <h1>Connexion</h1>
      {formError && <p style={{ color: "red" }}>{formError}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit} className="container-fluid">
        <div className="col d-flex flex-column align-items-center justify-content-center text-center">
          <div>
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
          <div>
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
          <button className="btn btn-primary mt-2" type="submit">Se connecter</button>
          
          <Link to="/register" className="nav-link px-2 active">
          Pas encore de compte ? Inscrivez-vous ici
              </Link>
        </div>
      </form>
    </div>
  );
};
