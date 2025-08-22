import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [inputValue, setInputValue] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        setInputValue({ ...inputValue, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (inputValue.password !== inputValue.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            // --- CORRECCIÓN CLAVE AQUÍ ---
            // Usamos la variable de entorno para construir la URL correcta
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: inputValue.email,
                    password: inputValue.password,
                    name: inputValue.name,       // <-- Asegúrate de que esta línea esté
                    lastName: inputValue.lastName
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Error al crear la cuenta.");
            }

            navigate('/acceder');

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '500px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="text-center mb-4">
                        <h3>Crear cuenta</h3>
                        <div>Ya tienes cuenta? <Link to="/acceder">Iniciar sesión</Link></div>
                    </div>

                    <div className="row g-2 mb-3">
                        <div className="col-md">
                            <div className="form-floating">
                                <input id="nameInput" className="form-control" placeholder="Nombre" name="name" type="text" value={inputValue.name} onChange={handleOnChange} required />
                                <label htmlFor="nameInput">Nombre</label>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-floating">
                                <input id="lastNameInput" className="form-control" placeholder="Apellido(s)" name="lastName" type="text" value={inputValue.lastName} onChange={handleOnChange} required />
                                <label htmlFor="lastNameInput">Apellido(s)</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-floating mb-3">
                        <input id="emailInput" className="form-control" placeholder="E-mail" name="email" type="email" value={inputValue.email} onChange={handleOnChange} required />
                        <label htmlFor="emailInput">Correo Electrónico</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input id="passwordInput" className="form-control" placeholder="Contraseña" name="password" type="password" value={inputValue.password} onChange={handleOnChange} required />
                        <label htmlFor="passwordInput">Contraseña</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input id="confirmPasswordInput" className="form-control" placeholder="Confirmar contraseña" name="confirmPassword" type="password" value={inputValue.confirmPassword} onChange={handleOnChange} required />
                        <label htmlFor="confirmPasswordInput">Confirmar contraseña</label>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <button className="btn btn-success w-100 py-2" type="submit">Registrarse</button>
                </form>

                <hr className="my-4" />

                <button className="btn btn-danger w-100 py-2" type="button">
                    <i className="fab fa-google me-2"></i> Iniciar con Google
                </button>
            </div>
        </div>
    );
}
