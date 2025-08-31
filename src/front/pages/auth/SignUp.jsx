// src/front/pages/auth/SignUp.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiSignup, apiLogin } from "../../utils/api";
import { saveToken, setUserLocal } from "../../utils/auth";

export default function SignUp() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (value.trim() !== "") setErrors((er) => ({ ...er, [name]: "" }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const er = {};

    if (!form.name.trim()) er.name = "Por favor ingresa tu nombre";
    if (!form.last_name.trim()) er.last_name = "Por favor ingresa tu(s) apellido(s)";

    if (!form.email.trim()) er.email = "Por favor ingresa tu correo";
    else if (!validateEmail(form.email)) er.email = "Por favor ingresa un correo válido";

    if (!form.password) er.password = "Por favor ingresa una contraseña";
    else if (form.password.length < 6) er.password = "La contraseña debe tener al menos 6 caracteres";

    if (!form.confirmPassword) er.confirmPassword = "Confirma tu contraseña";
    else if (form.password !== form.confirmPassword) er.confirmPassword = "Las contraseñas deben coincidir";

    return er;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) return;

    setLoading(true);
    try {
      // 1) Crear cuenta
      const signupResp = await apiSignup({
        name: form.name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        role: "traveler",
      });
      // 2) Guardar token si la API lo envía (nuestro backend lo envía)
      if (signupResp?.access_token) {
        saveToken(signupResp.access_token);
        setUserLocal(signupResp.user)
      } else {
        // Fallback: auto-login si el signup no trajo token
        const { access_token, user } = await apiLogin({
          email: form.email,
          password: form.password,
        });
        saveToken(access_token);
        setUserLocal(user)
      }

      // 3) Ir al panel
      nav("/panel", { replace: true });
    } catch (error) {
      setMsg(error.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="border col-12 col-md-8 col-lg-6 rounded p-4 shadow">
        <form onSubmit={onSubmit}>
          <div className="mb-3 text-center">
            <h3>Crear cuenta</h3>
            <div>
              ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-2 mb-md-0">
              <input
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Nombre"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="col-md-6">
              <input
                className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
                placeholder="Apellido(s)"
                name="last_name"
                type="text"
                value={form.last_name}
                onChange={handleChange}
              />
              {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
            </div>
          </div>

          <div className="mb-3">
            <input
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="E-mail"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <input
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-3">
            <input
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              placeholder="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          <button
            className="p-2 m-2 col-12 btn bg-success text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>

          <button
            className="btn border border-danger text-danger p-2 m-2 col-12"
            type="button"
            onClick={() => alert("OAuth pendiente")}
          >
            Iniciar con Google
          </button>

          {msg && <p className="text-danger mt-2">{msg}</p>}
        </form>
      </div>
    </div>
  );
}
