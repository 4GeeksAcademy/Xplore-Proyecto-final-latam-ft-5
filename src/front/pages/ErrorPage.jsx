// src/front/pages/ErrorPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center p-3">
            <h1 className="display-1 text-danger mb-3">¡Ups!</h1>
            <p className="lead mb-4">
                Algo salió mal. Por favor, intenta nuevamente más tarde.
            </p>
            <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate(-1)}
            >
                ← Volver
            </button>
        </div>
    );
}
