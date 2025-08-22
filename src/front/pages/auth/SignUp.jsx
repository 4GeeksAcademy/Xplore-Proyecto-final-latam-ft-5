import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiSignup, apiLogin } from "../../utils/api";
import { saveToken } from "../../utils/auth";

export default function SignUp() {
    const nav = useNavigate();
    const [input, setInput] = useState({
        name: "",
        last_name: "",     // <- el backend espera last_name
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [msg, setMsg] = useState("");

    function onChange(e) {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");

        if (input.password !== input.confirmPassword) {
            setMsg("Las contraseñas no coinciden");
            return;
        }
        try {
            // 1) signup
            await apiSignup({
                name: input.name,
                last_name: input.last_name,
                email: input.email,
                password: input.password,
                role: "traveler",
            });
            // 2) auto-login
            const { access_token } = await apiLogin(input.email, input.password);
            saveToken(access_token);
            // 3) redirigir al panel
            nav("/panel", { replace: true });
        } catch (err) {
            setMsg(err.message || "Error al crear la cuenta");
        }
    }

    return (
        <div className="container" style={{ maxWidth: 520, margin: "2rem auto" }}>
            <h3>Crear cuenta</h3>
            <p>¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>

            <form onSubmit={onSubmit} className="d-grid gap-2">
                <input className="form-control" name="name" placeholder="Nombre" value={input.name} onChange={onChange} />
                <input className="form-control" name="last_name" placeholder="Apellidos" value={input.last_name} onChange={onChange} />
                <input className="form-control" name="email" type="email" placeholder="E-mail" value={input.email} onChange={onChange} required />
                <input className="form-control" name="password" type="password" placeholder="Contraseña" value={input.password} onChange={onChange} required />
                <input className="form-control" name="confirmPassword" type="password" placeholder="Confirmar contraseña" value={input.confirmPassword} onChange={onChange} required />
                <button className="btn btn-success" type="submit">Registrarse</button>
                {msg && <p className="text-danger">{msg}</p>}
            </form>
        </div>
    );
}
