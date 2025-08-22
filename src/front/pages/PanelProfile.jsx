import { useEffect, useState } from "react";
import { apiProfile } from "../utils/api";
import { getToken } from "../utils/auth";

export default function PanelProfile() {
    const [user, setUser] = useState(null);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const u = await apiProfile(getToken());
                setUser(u);
            } catch (e) {
                setMsg(e.message || "Error cargando perfil");
            }
        })();
    }, []);

    if (msg) return <p className="text-danger">{msg}</p>;
    if (!user) return <p>Cargando…</p>;

    return (
        <div className="col-lg-6">
            <h3>Mi perfil</h3>
            <div className="card">
                <div className="card-body">
                    <p><strong>Nombre:</strong> {user.name} {user.last_name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Rol:</strong> {user.role}</p>
                    <p><strong>Activo:</strong> {user.is_active ? "Sí" : "No"}</p>
                </div>
            </div>
        </div>
    );
}
