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

// Auth
import SignUp from "./pages/auth/SignUp.jsx";
import Login from "./pages/auth/Login.jsx";
import RecoverPassword from "./pages/auth/RecoverPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

// Panel (páginas)
import Panel from "./pages/Panel.jsx";               // dashboard del panel
import BookingDate from "./pages/BookingDate.jsx";   // seleccionar fecha
import Payment from "./pages/Payment.jsx";           // método de pago
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
      {/* Si tienes página de ayuda, crea el componente y añade la ruta real */}
      {/* <Route path="ayuda" element={<Ayuda />} /> */}

      {/* Auth */}
      <Route path="signup" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route path="recover-password" element={<RecoverPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />

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
        <Route path="favorites" element={<PanelFavorites />} />
        <Route path="settings" element={<PanelSettings />} />
        <Route path="profile" element={<PanelProfile />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
