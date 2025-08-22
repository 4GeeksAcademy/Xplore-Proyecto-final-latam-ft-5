import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Panel from "./pages/Panel.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {/* Home como landing */}
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Navigate to="/" replace />} />

                {/* Acceso */}
                <Route path="/acceder" element={<Login />} />
                {/* Alias por si alguien usa /login */}
                <Route path="/login" element={<Navigate to="/acceder" replace />} />

                {/* Rutas protegidas */}
                <Route
                    path="/panel"
                    element={
                        <ProtectedRoute>
                            <Panel />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* 404 -> Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
