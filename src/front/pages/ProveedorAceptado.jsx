import React from "react";
import acepted from "../assets/img/acepted.png";
import { Link } from "react-router-dom";

export default function ProveedorAceptado() {
    return (
        <div className="d-flex justify-content-center align-items-center  px-3">
            <div className="card border-success p-3 text-center" style={{ maxWidth: "500px", width: "100%" }}>
                <h2>¡Bienvenido a la comunidad Xplora!</h2>
                <p>Gracias por registrarte como Experto, ya puedes contactarte con turistas de todo el mundo.</p>

                <img
                    src={acepted}
                    alt="Proveedor aceptado"
                    className="mx-auto my-4"
                    style={{ maxWidth: "120px", width: "100%", height: "auto" }}
                />

                <Link to='/create-tour' className="btn btn-success mt-4 w-100 w-md-auto">Crea tu primer Tour</Link>
            </div>
        </div>
    );
}
