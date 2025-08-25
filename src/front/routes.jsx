import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// Públicas
import { Layout } from "./pages/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Demo } from "./pages/Demo.jsx";
import NotFound from "./pages/NotFound.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import { TourDetail } from "./pages/TourDetail.jsx"; // <- IMPORTAR (named export)

// imports nuevos
import OrderSummary from "./pages/OrderSummary.jsx";
import BookingSuccess from "./pages/BookingSuccess.jsx";
import PanelReservation from "./pages/PanelReservation.jsx";

// Auth
import SignUp from "./pages/auth/SignUp.jsx";
import Login from "./pages/auth/Login.jsx";
import RecoverPassword from "./pages/auth/RecoverPassword.jsx";
import ProveedorSignUp from "./pages/auth/ProveedorSignUp.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ProveedorAceptado from "./pages/ProveedorAceptado.jsx";
// Creamos UNA SOLA configuración para el router

// Creamos UNA SOLA configuración para el routerimport { element } from "prop-types";
import HomeXpertos from "./pages/Xpertos/HomeXpertos";
import Profile from "./pages/touristUser/Profile.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ProveedorSignUp from "./pages/auth/ProveedorSignUp.jsx";

// Panel (páginas)
import Panel from "./pages/Panel.jsx";
import BookingDate from "./pages/BookingDate.jsx";
import Payment from "./pages/Payment.jsx";
import PanelFavorites from "./pages/PanelFavorites.jsx";
import PanelSettings from "./pages/PanelSettings.jsx";
import PanelProfile from "./pages/PanelProfile.jsx";

// Protegida
import ProtectedRoute from "./utils/auth/ProtectedRoute.jsx";

// Navbar del panel (tu componente)
import PanelNavbar from "./components/PanelNavbar.jsx";

// Shell del panel
function PanelShell() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <PanelNavbar />
      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  );
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<NotFound />}>
      {/* Home */}
      <Route index element={<Home />} />
      <Route path="home" element={<Navigate to="/" replace />} />

      {/* Públicas */}
      <Route path="demo" element={<Demo />} />
      <Route path="terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="tour/:tourId" element={<TourDetail />} />  {/* <- RUTA DE DETALLE */}

      {/* Auth */}
      <Route path="signup" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route path="recover-password" element={<RecoverPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="convierte-experto" element={<ProveedorSignUp />} />

      {/* --- RUTAS QUE TÚ CREASTE (AÑADIDAS AQUÍ) --- */}
      <Route path="/panel" element={<Panel />} />
      <Route path="/tour/:tourId" element={<TourDetail />} />
      <Route path="/convierte-experto" element={<ProveedorSignUp />} />
      <Route path="/proveedor-aceptado" element={<ProveedorAceptado />} />
      {/* Xpertos Route: */}
      <Route path="/xpertos" element={<HomeXpertos />} />
      {/* User Route: */}
      <Route path="/profile" element={<Profile />} />
      {/* ===== PANEL (PROTEGIDO) ===== */}
      <Route
        path="panel"
        element={
          <ProtectedRoute>
            <PanelShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Panel />} />
        <Route path="booking/:tourId/date" element={<BookingDate />} />
        <Route path="booking/:tourId/payment" element={<Payment />} />
        <Route path="booking/:tourId/summary" element={<OrderSummary />} />
        <Route path="booking/:tourId/success" element={<BookingSuccess />} />
        <Route path="reservations/:bookingId" element={<PanelReservation />} />
        <Route path="favorites" element={<PanelFavorites />} />
        <Route path="settings" element={<PanelSettings />} />
        <Route path="profile" element={<PanelProfile />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
