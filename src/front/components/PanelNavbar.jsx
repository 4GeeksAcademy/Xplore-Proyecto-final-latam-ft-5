import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Settings, User, Search } from 'lucide-react'; // Usamos íconos

export const PanelNavbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
            <div className="container-fluid">
                {/* Search Bar */}
                <form className="d-flex flex-grow-1 me-3" role="search">
                    <div className="input-group">
                        <span className="input-group-text bg-light border-0" id="basic-addon1">
                            <Search size={20} />
                        </span>
                        <input
                            className="form-control border-0 bg-light"
                            type="search"
                            placeholder="Buscar un destino..."
                            aria-label="Search"
                        />
                    </div>
                </form>

                {/* User Icons */}
                <ul className="navbar-nav flex-row gap-3 ms-auto align-items-center">
                    <li className="nav-item">
                        <Link to="/favoritos" className="nav-link">
                            <Heart size={24} />
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/configuracion" className="nav-link">
                            <Settings size={24} />
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/perfil" className="nav-link">
                            {/* Puedes reemplazar esto con la imagen de perfil del usuario */}
                            <img
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                alt="User"
                                className="rounded-circle"
                                style={{ width: '32px', height: '32px' }}
                            />
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};
