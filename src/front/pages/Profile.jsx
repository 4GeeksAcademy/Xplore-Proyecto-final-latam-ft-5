import { useEffect, useState } from "react";
import { apiProfile } from "../utils/api";
import { getToken, clearToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const nav = useNavigate();
    const [user, setUser] = useState(null);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const u = await apiProfile(getToken());
                setUser(u);
            } catch (e) {
                setMsg(e.message);
            }
        })();
    }, []);

    function logout() {
        clearToken();
        nav("/login");
    }

    if (msg) return <p style={{ color: "crimson" }}>{msg}</p>;
    if (!user) return <p>Cargando...</p>;

    return (
        <div style={{ maxWidth: 720, margin: "4rem auto", fontFamily: "system-ui, sans-serif" }}>
            <h2 style={{ marginBottom: 16 }}>Perfil</h2>
            <pre
                style={{
                    background: "#f6f8fa",
                    padding: 16,
                    borderRadius: 12,
                    overflowX: "auto",
                    lineHeight: 1.4
                }}
            >
                {JSON.stringify(user, null, 2)}
            </pre>
            <button onClick={logout}>Cerrar sesión</button>
        </div>
    );
}
