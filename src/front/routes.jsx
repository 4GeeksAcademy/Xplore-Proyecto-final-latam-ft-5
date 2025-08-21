import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/Layout.jsx";
import { Home } from "./pages/Home.jsx"; // Tu página pública
import { Panel } from "./pages/Panel.jsx"; // El panel del usuario logueado
import { TourDetail } from "./pages/TourDetail.jsx";

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