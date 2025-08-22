// src/front/pages/auth/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // State to hold the user's input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Hook to redirect the user after a successful login
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the form from reloading the page
        setError(''); // Clear previous errors

        // --- Frontend sends data to the Backend ---
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // --- Login successful ---
            console.log("Login successful!", data);

            // Store the token in localStorage to "remember" the user
            localStorage.setItem('user_token', data.token);

            // Redirect the user to their Panel page
            navigate('/panel');
        } else {
            // --- Login failed ---
            console.error("Login failed:", data.msg);
            setError(data.msg || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Ingresa a tu cuenta</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="emailInput" className="form-label">Correo electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            id="emailInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passwordInput" className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="passwordInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Display error message if login fails */}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                </form>
            </div>
        </div>
    );
};

export default Login; // Use default export to match your routes file if needed
