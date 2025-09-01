import { Outlet } from "react-router-dom";
import PanelNavbar from "../../components/panel/PanelNavbar.jsx";

export default function PanelLayout() {
    return (
        <div className="min-vh-100 d-flex flex-column">
            <PanelNavbar />
            <main className="container py-4">
                <Outlet />
            </main>
        </div>
    );
}
