import ScrollToTop from "../components/ScrollToTop"
import { Jumbotron } from "../components/Jumbotron"
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import "../styles/Navbar.css";

export const Layout = () => {
    return (
        <div>
            <main>
                <Navbar />
                {/* El <Outlet /> es un espacio que será reemplazado por el 
                    componente de la ruta actual (Home, Panel, etc.) */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};