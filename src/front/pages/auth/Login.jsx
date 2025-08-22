import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Error al iniciar sesión");
            }

            // Login exitoso
            localStorage.setItem('user_token', data.token);
            navigate('/panel'); // Redirigir al panel

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '450px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="text-center mb-4">
                        <h3>Iniciar sesión</h3>
                        <div>No tienes cuenta? <Link to="/crear-cuenta">Crear cuenta</Link></div>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            id="emailInput"
                            className="form-control"
                            placeholder="E-mail"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="emailInput">Correo Electrónico</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input
                            id="passwordInput"
                            className="form-control"
                            placeholder="Contraseña"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="passwordInput">Contraseña</label>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <button className="btn btn-primary w-100 py-2" type="submit">
                        Iniciar sesión
                    </button>

                    <div className="text-center mt-3">
                        <Link to="/recuperar-contraseña">Olvidé mi contraseña</Link>
                    </div>

                    <hr className="my-4" />

                    <button className="btn btn-danger w-100 py-2" type="button">
                        <i className="fab fa-google me-2"></i> Iniciar con Google
                    </button>
                </form>
            </div>
        </div>
    );
}
