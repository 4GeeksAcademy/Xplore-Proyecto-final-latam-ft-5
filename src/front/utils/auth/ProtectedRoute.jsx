import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./index";

export default function ProtectedRoute({ children }) {
    return isLoggedIn() ? children : <Navigate to="/acceder" replace />;
}
