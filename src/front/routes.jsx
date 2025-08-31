// src/front/routes.jsx
import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, Navigate, Outlet } from "react-router-dom";

// Públicas
import { Layout } from "./pages/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { Demo } from "./pages/Demo.jsx";
import NotFound from "./pages/NotFound.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import { TourDetail } from "./pages/TourDetail.jsx";

// Booking (público)
import BookingDate from "./pages/BookingDate.jsx";
import Payment from "./pages/Payment.jsx";
import OrderSummary from "./pages/OrderSummary.jsx";
import BookingSuccess from "./pages/BookingSuccess.jsx";

// Auth
import SignUp from "./pages/auth/SignUp.jsx";
import Login from "./pages/auth/Login.jsx";
import RecoverPassword from "./pages/auth/RecoverPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ProveedorSignUp from "./pages/auth/ProveedorSignUp.jsx";
import LoginXpertos from "./pages/Xpertos/LoginXpertos.jsx";

// Xpertos
import ProveedorAceptado from "./pages/ProveedorAceptado.jsx";
import HomeXpertos from "./pages/Xpertos/HomeXpertos.jsx";
import PerfilProveedor from "./pages/PerfilProveedor.jsx";
import CreateTour from "./pages/Xpertos/CreateTour.jsx";
import MyToursXperts from "./pages/Xpertos/MyToursXperts.jsx";
import EditTour from "./pages/Xpertos/EditTour.jsx";
import TourDetailXpert from "./pages/Xpertos/TourDetailXpert.jsx";

// Panel User
import Panel from "./pages/Panel.jsx";
import Profile from "./pages/touristUser/Profile.jsx";
import PanelFavorites from "./pages/PanelFavorites.jsx";
import PanelSettings from "./pages/PanelSettings.jsx";
import PanelProfile from "./pages/PanelProfile.jsx";
import ProtectedRoute from "./utils/auth/ProtectedRoute.jsx";
import PanelNavbar from "./components/PanelNavbar.jsx";
import PanelReservation from "./pages/PanelReservation.jsx";
import PanelReservationDetail from "./pages/PanelReservationDetail.jsx";

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
      <Route path="tour/:tourId" element={<TourDetail />} />

      {/* Booking público */}
      <Route path="booking/:tourId/date" element={<BookingDate />} />
      <Route path="booking/:tourId/payment" element={<Payment />} />
      <Route path="booking/:tourId/summary" element={<OrderSummary />} />
      <Route path="booking/:tourId/success" element={<BookingSuccess />} />

      {/* Auth */}
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="recover-password" element={<RecoverPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="convierte-experto" element={<ProveedorSignUp />} />
      <Route path="proveedor-aceptado" element={<ProveedorAceptado />} />
      <Route path="login-xpertos" element={<LoginXpertos />} />

      {/* Otros públicos */}
      <Route path="xpertos" element={<HomeXpertos />} />
      <Route path="profile" element={<Profile />} />
      <Route path="proveedor/:id" element={<PerfilProveedor />} />

      {/* ===== PANEL (protegido) ===== */}
      <Route
        path="panel"
        element={
          <ProtectedRoute>
            <PanelShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Panel />} />
        <Route path="reservations" element={<PanelReservation />} />
        <Route path="reservations/:id" element={<PanelReservationDetail />} />
        <Route path="favorites" element={<PanelFavorites />} />
        <Route path="settings" element={<PanelSettings />} />
        <Route path="profile" element={<PanelProfile />} />
        <Route path="tours" element={<MyToursXperts />} />
        <Route path="tours/create" element={<CreateTour />} />
        <Route path="tours/:tourId" element={<TourDetailXpert />} />
        <Route path="tours/:tourId/edit" element={<EditTour />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
