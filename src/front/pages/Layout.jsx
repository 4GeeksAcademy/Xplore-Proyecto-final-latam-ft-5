import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Jumbotron } from "../components/Jumbotron"
import React from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer.jsx"; // Asumiendo que tienes un Footer

export const Layout = () => {
    return (
        <div>
            <Navbar />
            <Jumbotron />
            <main>
                {/* El <Outlet /> es un espacio que será reemplazado por el 
                    componente de la ruta actual (Home, Panel, etc.) */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};