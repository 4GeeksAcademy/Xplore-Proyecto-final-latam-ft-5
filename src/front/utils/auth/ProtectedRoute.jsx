import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { isLoggedIn, getToken } from "./index";

export default function ProtectedRoute({ children }) {
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = getToken();
            const authenticated = isLoggedIn();

            console.log("Verificando autenticación:", {
                path: location.pathname,
                hasToken: !!token,
                isAuthenticated: authenticated
            });

            setIsAuthenticated(authenticated);
            setIsChecking(false);
        };

        checkAuth();
    }, [location]);

    if (isChecking) {
        return <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Verificando autenticación...</span>
            </div>
        </div>;
    }

    if (!isAuthenticated) {
        console.log("Usuario no autenticado, redirigiendo a login");
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
}
