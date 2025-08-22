import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx"; // El Navbar público
import { PanelNavbar } from "../components/PanelNavbar.jsx"; // El Navbar del panel
import { Footer } from "../components/Footer.jsx";

export const Layout = () => {
    const location = useLocation();

    // --- CORRECCIÓN APLICADA AQUÍ ---
    // Convertimos la ruta a minúsculas para evitar problemas de mayúsculas/minúsculas
    const currentPath = location.pathname.toLowerCase();

    // Verificamos si la ruta actual (en minúsculas) es parte del área privada del usuario
    const isPanelSection = currentPath.startsWith('/panel') ||
        currentPath.startsWith('/favoritos') ||
        currentPath.startsWith('/perfil') ||
        currentPath.startsWith('/configuracion');

    return (
        <div>
            {/* Si es una sección del panel, muestra PanelNavbar, si no, el Navbar público */}
            {isPanelSection ? <PanelNavbar /> : <Navbar />}

            <main>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};
