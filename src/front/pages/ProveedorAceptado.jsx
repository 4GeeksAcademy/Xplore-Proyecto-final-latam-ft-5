import { Link } from "react-router-dom";
import acepted from "../assets/img/acepted.png";

export default function ProveedorAceptado() {
    return (
        <div className="d-flex justify-content-center align-items-center px-3">
            <div className="card border-success p-3 text-center" style={{ maxWidth: 500, width: "100%" }}>
                <h2>¡Bienvenido a la comunidad Xplora!</h2>
                <p>Gracias por registrarte como Experto, ya puedes contactarte con turistas de todo el mundo.</p>
                <img src={acepted} alt="Proveedor aceptado" className="mx-auto my-4" style={{ maxWidth: 120, height: "auto" }} />
                <Link to="/CreateTour.jsx" className="btn btn-success mt-4 w-100">Crea tu primer Tour</Link>
            </div>
        </div>
    );
}
