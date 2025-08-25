import { useState } from "react";
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
}
