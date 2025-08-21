import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout.jsx";
import { Home } from "./pages/Home.jsx"; // Tu página pública
import { Panel } from "./pages/Panel.jsx"; // El panel del usuario logueado
import { TourDetail } from "./pages/TourDetail.jsx";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import NotFound from "./pages/NotFound";
import TermsAndConditions from "./pages/TermsAndConditions";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import RecoverPassword from "./pages/auth/RecoverPassword";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<NotFound />} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="/demo" element={<Demo />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

      {/* AUTH ROUTES: */}
      <Route path="/crear-cuenta" element={<SignUp />} />
      <Route path="/acceder" element={<Login />} />
      <Route path="/recuperar-contraseña" element={<RecoverPassword />} />

    </Route>
  )
);
// Creamos el "mapa" de la aplicación
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Todas las rutas usarán este Layout (Navbar/Footer)
    children: [
      {
        // Cuando la URL es "/", dentro del Layout se mostrará el componente Home
        path: "/",
        element: <Home />
      },
      {
        // Cuando la URL es "/panel", dentro del Layout se mostrará el Panel
        path: "/panel",
        element: <Panel />
      },
      {
        // Ruta para los detalles de un tour específico
        path: "/tour/:tourId",
        element: <TourDetail />
      }
      // Aquí puedes agregar más rutas como /login, /registro, etc.
    ]
  }
]);
