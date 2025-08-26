import React from 'react';
import logo from "/workspaces/Xplore-Proyecto-final-latam-ft-5/docs/assets/Xplora logo png.png"
import { Link } from 'react-router-dom';



const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-md bg-body-tertiary px-5">
            <div className="container-fluid px-4">
                {/* Logo */}
                <Link to="/">
                    <button type="button" className="btn btn-link p-0 border-0">
                        <img
                            src={logo}
                            alt="Logo"
                            width="200px"
                            className="d-inline-block align-text-top"
                        />
                    </button>
                </Link>

                {/* Botón hamburguesa */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarButtons"
                    aria-controls="navbarButtons"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Contenido colapsable */}
                <div className="collapse navbar-collapse justify-content-end" id="navbarButtons">
                    <div className="d-flex gap-2 mt-3 mt-md-0">

                        <Link to="/login">
                            <button
                                className="btn"
                                type="button"
                                style={{ backgroundColor: "#ffffff", padding: "10px 24px", }}
                            >
                                Iniciar sesión
                            </button>
                        </Link>
                        <Link to="/convierte-experto">
                            <button
                                className="btn"
                                type="button"
                                style={{ backgroundColor: "#B9E3E1", color: "#2D7363", padding: "10px 24px" }}
                            >
                                Empezar
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>



    );
};

export default NavBar;