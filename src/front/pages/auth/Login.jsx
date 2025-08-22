import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiLogin } from "../../utils/api";
import { saveToken } from "../../utils/auth";

export default function Login() {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");
        try {
            const { access_token } = await apiLogin(email, password);
            saveToken(access_token);
            nav("/panel", { replace: true });
        } catch (err) {
            setMsg(err.message || "Error al iniciar sesión");
        }
    }

    return (
        <div className="container" style={{ maxWidth: 520, margin: "2rem auto" }}>
            <h3>Iniciar sesión</h3>
            <p>¿No tienes cuenta? <Link to="/signup">Crear cuenta</Link></p>
            <form onSubmit={onSubmit} className="d-grid gap-2">
                <input className="form-control" type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
                <input className="form-control" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
                <button className="btn btn-primary" type="submit">Entrar</button>
                {msg && <p className="text-danger">{msg}</p>}
            </form>
        </div>
    );
}
