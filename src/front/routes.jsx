import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

// Importamos TODOS los componentes de página necesarios de ambas versiones
import { Layout } from "./pages/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Panel } from "./pages/Panel.jsx"; // Tu panel de usuario
import { TourDetail } from "./pages/TourDetail.jsx"; // Tu página de detalle de tour
import { Single } from "./pages/Single.jsx";
import { Demo } from "./pages/Demo.jsx";
import NotFound from "./pages/NotFound.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import Login from "./pages/auth/Login.jsx";
import RecoverPassword from "./pages/auth/RecoverPassword.jsx";
import ProveedorSignUp from "./pages/auth/ProveedorSignUp.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

// Creamos UNA SOLA configuración para el router
export const router = createBrowserRouter(
  createRoutesFromElements(
    // Todas las rutas se anidan dentro del Layout para que compartan Navbar y Footer
    <Route path="/" element={<Layout />} errorElement={<NotFound />} >

      {/* Rutas que ya tenía tu compañero */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

      {/* Rutas de Autenticación que ya tenía tu compañero */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recover-password" element={<RecoverPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* --- RUTAS QUE TÚ CREASTE (AÑADIDAS AQUÍ) --- */}
      <Route path="/panel" element={<Panel />} />
      <Route path="/tour/:tourId" element={<TourDetail />} />
      <Route path="/convierte-experto" element={<ProveedorSignUp />} />
    </Route>
  )
);