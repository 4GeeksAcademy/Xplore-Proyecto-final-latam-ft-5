import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Jumbotron } from "../components/Jumbotron"
import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx"; // Asumiendo que tienes un Navbar
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