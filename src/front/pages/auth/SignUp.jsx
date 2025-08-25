import { useState } from "react";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";

/* ==== Helpers inline (sin utils) ==== */
const BASE = (import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001").replace(/\/+$/, "");

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options,
    });
    const ct = res.headers.get("content-type") || "";
    const data = ct.includes("application/json") ? await res.json() : await res.text();
    if (!res.ok) {
        const msg = typeof data === "string" ? data : data?.msg || data?.error || res.statusText;
        throw new Error(msg || "Request error");
    }
    return data;
}

async function apiSignup(payload) {
    // payload: { name, last_name, email, password, role }
    return request("/api/signup", { method: "POST", body: JSON.stringify(payload) });
}
async function apiLogin(email, password) {
    // response: { access_token, user? }
    return request("/api/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

const TOKEN_KEY = "access_token";
function saveToken(token) { localStorage.setItem(TOKEN_KEY, token); }
/* ==================================== */

export default function SignUp() {
    const nav = useNavigate();

    const [inputValue, setInputValue] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState("");

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        // ✅ actualización funcional para evitar estado obsoleto
        setInputValue(prev => ({ ...prev, [name]: value }));
        if (value.trim() !== "") setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        setSubmitting(true);

        const newErrors = {};

        // Vacíos
        Object.entries(inputValue).forEach(([field, val]) => {
            const str = typeof val === "string" ? val : String(val ?? "");
            if (!str.trim()) newErrors[field] = "Por favor ingresa la información";
        });

        // Email
        if (inputValue.email && !validateEmail(inputValue.email)) {
            newErrors.email = "Por favor ingresa un correo válido";
        }

        // Password len
        if ((inputValue.password ?? "").length <= 5) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        // Coincidencia
        if (
            inputValue.password &&
            inputValue.confirmPassword &&
            inputValue.password !== inputValue.confirmPassword
        ) {
            newErrors.confirmPassword = "Las contraseñas deben coincidir";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            setSubmitting(false);
            return;
        }

        try {
            // 1) signup (el backend espera last_name)
            await apiSignup({
                name: inputValue.name,
                last_name: inputValue.lastName,
                email: inputValue.email,
                password: inputValue.password,
                role: "traveler",
            });

            // 2) auto-login
            const { access_token } = await apiLogin(inputValue.email, inputValue.password);
            saveToken(access_token);

            // 3) panel
            nav("/panel", { replace: true });
        } catch (error) {
            setMsg(error.message || "Error al crear la cuenta");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="border col-12 col-md-8 col-lg-6 rounded p-4 shadow">
                <form onSubmit={handleSubmit} noValidate>
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
                                value={inputValue.name}
                                onChange={handleOnChange}
                                autoComplete="given-name"
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                        <div className="col-md-6">
                            <input
                                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                                placeholder="Apellido(s)"
                                name="lastName"
                                type="text"
                                value={inputValue.lastName}
                                onChange={handleOnChange}
                                autoComplete="family-name"
                            />
                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                        </div>
                    </div>

                    <div className="mb-3">
                        <input
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            placeholder="E-mail"
                            name="email"
                            type="email"
                            value={inputValue.email}
                            onChange={handleOnChange}
                            autoComplete="email"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                        <input
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            placeholder="Contraseña"
                            type="password"
                            name="password"
                            value={inputValue.password}
                            onChange={handleOnChange}
                            autoComplete="new-password"
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <div className="mb-3">
                        <input
                            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                            placeholder="Confirmar contraseña"
                            type="password"
                            name="confirmPassword"
                            value={inputValue.confirmPassword}
                            onChange={handleOnChange}
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && (
                            <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                    </div>

                    {msg && <p className="text-danger mb-2">{msg}</p>}

                    <button className="p-2 m-2 col-12 btn bg-success text-white" type="submit" disabled={submitting}>
                        {submitting ? "Creando cuenta..." : "Registrarse"}
                    </button>
                </form>

                <button className="btn border border-danger text-danger p-2 m-2 col-12" type="button">
                    Iniciar con Google
                </button>
            </div>
        </div>
    );
=======
import { useNavigate, Link } from "react-router-dom";
import { apiSignup, apiLogin } from "../../utils/api";
import { saveToken } from "../../utils/auth";

export default function SignUp() {
  const nav = useNavigate();

  // estado del formulario (nombres que espera el backend)
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // limpiar error del campo si el usuario escribe algo
    if (value.trim() !== "") {
      setErrors((er) => ({ ...er, [name]: "" }));
    }
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

    try {
      // 1) crear cuenta
      await apiSignup({
        name: form.name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        role: "traveler",
      });

      // 2) auto-login
      const { access_token } = await apiLogin(form.email, form.password);
      saveToken(access_token);

      // 3) ir al panel
      nav("/panel", { replace: true });
    } catch (error) {
      setMsg(error.message || "Error al crear la cuenta");
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
              {errors.last_name && (
                <div className="invalid-feedback">{errors.last_name}</div>
              )}
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
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
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
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>

          <button className="p-2 m-2 col-12 btn bg-success text-white" type="submit">
            Registrarse
          </button>

          {/* Placeholder OAuth */}
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
>>>>>>> origin/Back-work
}
