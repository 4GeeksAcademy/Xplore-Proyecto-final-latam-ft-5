import { Link, NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn, clearToken } from "../utils/auth";
import logo from "../assets/img/Xplora_logo.png";
import "../styles/Navbar.css";

function Navbar() {
  const nav = useNavigate();
  const logged = isLoggedIn();

  function logout(e) {
    e.preventDefault();
    clearToken();
    nav("/login", { replace: true });
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src={logo} alt="Xplora" height="28" />
          <span className="fw-bold"></span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink className="nav-link" to="/">Inicio</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/demo">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/terms-and-conditions">Tours</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/ayuda">Ayuda</NavLink></li>
          </ul>
<<<<<<< HEAD
          {/* ACTUALIZAR LINKS */}
          <div className="d-flex flex-column flex-sm-row  gap-2 mt-3 mt-lg-0 ms-lg-auto">
            <Link to="/convierte-experto" className="btn btn-experto rounded-pill px-3">
              Conviértete en Experto
            </Link>
            <button className="btn btn-login rounded-pill px-3">
              <Link to='/login' className="btn-login text-decoration-none">
                Iniciar sesión / Registrarse
              </Link>
            </button>
=======

          <div className="d-flex flex-column flex-sm-row gap-2 ms-lg-auto">
            <Link to="/convierte-experto" style={{ backgroundColor: '#2d7360', color: '#fff', border: 'none' }} className="btn btn-experto rounded-pill px-3">
              Conviértete en Experto
            </Link>

            {!logged ? (
              <Link to="/login" style={{ backgroundColor: '#B9E3E1', color: '#fff', border: 'none' }} className="btn btn-outline rounded-pill px-3 btn-login">
                Iniciar sesión / Registrarse
              </Link>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/panel" style={{ backgroundColor: '#a0e0a0' }} className="btn btn-primary rounded-pill px-3">Ir al Panel</Link>
                <button className="btn btn-outline-danger rounded-pill px-3" onClick={logout}>Salir</button>
              </div>
            )}
>>>>>>> origin/Back-work
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
export { Navbar };
