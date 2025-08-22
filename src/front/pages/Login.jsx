import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiLogin, apiSignup } from "../utils/api";
import { saveToken } from "../utils/auth";

export default function LoginPage() {
    const nav = useNavigate();
    const { search } = useLocation();
    const qsMode = new URLSearchParams(search).get("mode");
    const [mode, setMode] = useState(qsMode === "signup" ? "signup" : "login");
    const isSignup = useMemo(() => mode === "signup", [mode]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (qsMode === "signup") setMode("signup");
        else if (qsMode === "login") setMode("login");
    }, [qsMode]);

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");

        try {
            if (isSignup) {
                // 1) crear cuenta
                await apiSignup({
                    email,
                    password,
                    name,
                    last_name: lastName,
                    role: "traveler",
                });
                // 2) auto-login y redirigir al Panel
                const { access_token } = await apiLogin(email, password);
                saveToken(access_token);
                nav("/Panel", { replace: true });
            } else {
                // login normal
                const { access_token } = await apiLogin(email, password);
                saveToken(access_token);
                nav("/Panel", { replace: true });
            }
        } catch (err) {
            setMsg(err.message || "Error");
        }
    }

    return (
        <div className="container" style={{ maxWidth: 520, margin: "2rem auto" }}>
            <h2 style={{ marginBottom: 12 }}>
                {isSignup ? "Crear cuenta" : "Iniciar sesión"}
            </h2>

            <form onSubmit={onSubmit} className="d-grid gap-2">
                {isSignup && (
                    <div className="d-grid gap-2" style={{ marginBottom: 8 }}>
                        <input
                            className="form-control"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            className="form-control"
                            placeholder="Apellidos"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                )}

                <input
                    className="form-control"
                    type="email"
                    required
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: 8 }}
                />
                <input
                    className="form-control"
                    type="password"
                    required
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginBottom: 12 }}
                />

                <button className="btn btn-primary" type="submit">
                    {isSignup ? "Crear cuenta" : "Entrar"}
                </button>

                <div style={{ marginTop: 10 }}>
                    {isSignup ? (
                        <span>
                            ¿Ya tienes cuenta?{" "}
                            <a href="/acceder?mode=login" onClick={(e) => { e.preventDefault(); setMode("login"); }}>
                                Inicia sesión
                            </a>
                        </span>
                    ) : (
                        <span>
                            ¿No tienes cuenta?{" "}
                            <a href="/acceder?mode=signup" onClick={(e) => { e.preventDefault(); setMode("signup"); }}>
                                Crear cuenta
                            </a>
                        </span>
                    )}
                </div>

                {msg && <p style={{ color: "crimson", marginTop: 8 }}>{msg}</p>}
            </form>
        </div>
    );
}
