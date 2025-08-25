import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearToken } from "../utils/auth";

export default function PanelNavbar() {
    const nav = useNavigate();

    function logout() {
        clearToken();
        nav("/login", { replace: true });
    }

    return (
        <nav className="navbar navbar-expand bg-light border-bottom px-3">
            <Link className="navbar-brand fw-bold me-3" to="/panel">Xplora • Panel</Link>

            <form
                className="d-flex me-auto"
                role="search"
                onSubmit={(e) => { e.preventDefault(); /* aquí harías la búsqueda */ }}
            >
                <input className="form-control" type="search" placeholder="Buscar tours..." />
            </form>

            <ul className="navbar-nav gap-2 align-items-center">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/panel/favorites" title="Favoritos">❤️</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/panel/settings" title="Ajustes">⚙️</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/panel/profile" title="Perfil">👤</NavLink>
                </li>
                <li className="nav-item">
                    <button className="btn btn-outline-danger btn-sm" onClick={logout}>Salir</button>
                </li>
            </ul>
        </nav>
    );
}
