import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/Xplora_logo.png";
import '../styles/Navbar.css';

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4">
      <div className="container-fluid">
   
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo_Xplora" width="110px" height="40px" />
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav flex-column flex-lg-row gap-3 mb-0">
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/nosotros">Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/tours">Tours</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" to="/ayuda">Ayuda</Link>
            </li>
          </ul>
               {/* ACTUALIZAR LINKS */}
          <div className="d-flex flex-column flex-sm-row  gap-2 mt-3 mt-lg-0 ms-lg-auto">
            <Link to="/convierte-experto" className="btn btn-experto rounded-pill px-3">
              Conviértete en Experto
            </Link>
            <Link className="btn btn-login rounded-pill px-3">
              Iniciar sesión / Registrarse
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
