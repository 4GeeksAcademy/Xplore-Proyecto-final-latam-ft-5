import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiLogin } from "../../utils/api";
import { saveToken } from "../../utils/auth";

export default function Login() {
    const nav = useNavigate();
    const [input, setInput] = useState({ email: "", password: "" });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const onChange = (e) =>
        setInput({ ...input, [e.target.name]: e.target.value });

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");
        setLoading(true);
        try {
            // ⬇️ apiLogin espera un objeto { email, password }
            const { access_token, ...rest } = await apiLogin({
                email: input.email,
                password: input.password,
            });
            console.log("El rest", rest)
            saveToken(access_token);
            nav("/panel", { replace: true });
        } catch (err) {
            setMsg(err.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
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
                            autoComplete="email"
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
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        className="p-2 mb-3 col-12 btn bg-success text-white"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>

                    <button
                        className="btn border border-danger text-danger p-2 mb-2 col-12"
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
