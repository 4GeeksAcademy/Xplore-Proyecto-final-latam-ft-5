// PanelNavbar.jsx
import { Link, NavLink } from "react-router-dom";

export default function PanelNavbar() {
    return (
        <nav className="navbar navbar-light bg-white border-bottom">
            <div className="container">
                <Link to="/panel" className="navbar-brand fw-bold">Xplora • Panel</Link>
                <ul className="navbar-nav flex-row gap-3">
                    <li className="nav-item">
                        <NavLink to="/panel" className="nav-link">Reservas</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/panel/favorites" className="nav-link">Favoritos</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/panel/profile" className="nav-link">Perfil</NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
