import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { saveToken, saveUser } from "../../utils/auth";
import { apiProveedorLogin } from "../../utils/apiGuias";

export default function LoginXpertos() {
    const nav = useNavigate();
    const loc = useLocation();
    const from = loc.state?.from?.pathname || "/panel/tours/create";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);
        try {
            const r = await apiProveedorLogin(email.trim().toLowerCase(), password);
            const token = r?.access_token || r?.data?.access_token;
            if (!token) throw new Error("No se recibió token");
            saveToken(token);
            saveUser(r?.user);
            nav(from, { replace: true });
        } catch (e2) {
            setErr(e2.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-5">
                    <h3 className="mb-3">Inicia sesión (Xpertos)</h3>
                    {err && <div className="alert alert-danger">{err}</div>}

                    <form onSubmit={onSubmit} noValidate>
                        <div className="mb-3">
                            <label className="form-label">Correo</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Ingresando..." : "Ingresar"}
                        </button>
                    </form>

                    <div className="mt-3 text-center">
                        <small>
                            ¿Aún no eres proveedor?{" "}
                            <Link to="/convierte-experto">Regístrate</Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}
