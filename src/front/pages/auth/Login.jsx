// src/front/pages/auth/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiLogin } from "../../utils/api";
import { saveToken } from "../../utils/auth";

export default function Login() {
    const nav = useNavigate();
    const [input, setInput] = useState({ email: "", password: "" });
    const [msg, setMsg] = useState("");

    const onChange = (e) =>
        setInput({ ...input, [e.target.name]: e.target.value });

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");
        try {
            const { access_token } = await apiLogin(input.email, input.password);
            saveToken(access_token);
            nav("/panel", { replace: true }); // ✅ ir al Panel después de login
        } catch (err) {
            setMsg(err.message || "Error al iniciar sesión");
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="border col-12 col-md-8 col-lg-6 rounded p-4 shadow">
                <form onSubmit={onSubmit}>
                    <div className="mb-3 text-center">
                        <h3>Iniciar sesión</h3>
                        <div>
                            ¿No tienes cuenta? <Link to="/signup">Crear cuenta</Link>
                        </div>
                    </div>

                    <div className="mb-3">
                        <input
                            className="form-control"
                            placeholder="E-mail"
                            name="email"
                            type="email"
                            value={input.email}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            className="form-control"
                            placeholder="Contraseña"
                            name="password"
                            type="password"
                            value={input.password}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <button className="btn btn-primary w-100" type="submit">
                        Entrar
                    </button>

                    {/* Botón placeholder por si luego conectan OAuth */}
                    <button
                        className="btn border border-2 mt-2 w-100"
                        type="button"
                        onClick={() => alert("OAuth pendiente")}
                    >
                        Iniciar con Google
                    </button>

                    {msg && <p className="text-danger mt-2">{msg}</p>}

                    <div className="mt-2 text-end">
                        <Link to="/recover-password">Olvidé mi contraseña</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
