// src/front/pages/PanelProfile.jsx
import { useEffect, useMemo, useState } from "react";
import { getToken } from "../utils/auth";
import { apiProfile, apiUpdateProfile } from "../utils/api";
import "../styles/Profile.css";

export default function PanelProfile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ type: "", text: "" });

    const [form, setForm] = useState({
        name: "",
        last_name: "",
        email: "",
        phone: "",
    });

    const initials = useMemo(() => {
        const n = `${form.name || ""} ${form.last_name || ""}`.trim();
        return n
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s[0]?.toUpperCase())
            .join("");
    }, [form.name, form.last_name]);

    useEffect(() => {
        (async () => {
            try {
                const token = getToken();
                const me = await apiProfile(token);
                setForm({
                    name: me.name || "",
                    last_name: me.last_name || "",
                    email: me.email || "",
                    phone: me.phone || "", // si tu modelo no tiene phone, quedará ""
                });
            } catch (e) {
                setMsg({ type: "danger", text: e.message || "No se pudo cargar el perfil" });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        if (msg.text) setMsg({ type: "", text: "" });
    };

    const onSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg({ type: "", text: "" });
        try {
            const token = getToken();
            // enviamos solo campos editables
            await apiUpdateProfile(token, {
                name: form.name,
                last_name: form.last_name,
                phone: form.phone, // si el modelo no lo tiene, el backend lo ignora
            });
            setMsg({ type: "success", text: "Perfil actualizado correctamente" });
        } catch (e) {
            setMsg({ type: "danger", text: e.message || "Error al guardar" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-wrap container">
                <div className="text-center py-5">Cargando tu perfil…</div>
            </div>
        );
    }

    return (
        <div className="profile-wrap container py-4">
            {/* Sidebar */}
            <aside className="profile-aside">
                <div className="profile-card p-3">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="profile-avatar">
                            {initials || "👤"}
                        </div>
                        <div>
                            <div className="fw-bold">{form.name || "Tu nombre"}</div>
                            <div className="text-muted small">{form.email}</div>
                        </div>
                    </div>

                    <nav className="profile-nav">
                        <a className="active" href="#perfil" onClick={(e) => e.preventDefault()}>Perfil</a>
                        <a href="#notificaciones" onClick={(e) => e.preventDefault()}>Notificaciones</a>
                        <a href="#metodos" onClick={(e) => e.preventDefault()}>Tarjetas guardadas</a>
                    </nav>

                    <div className="profile-note small mt-3">
                        Mantén tu información al día para una mejor experiencia.
                    </div>
                </div>
            </aside>

            {/* Contenido */}
            <section className="profile-content">
                <div className="profile-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="m-0">Detalles del perfil</h3>
                        {saving && <span className="spinner-border spinner-border-sm text-secondary" />}
                    </div>

                    {msg.text && (
                        <div className={`alert alert-${msg.type} mb-3`} role="alert">
                            {msg.text}
                        </div>
                    )}

                    <form onSubmit={onSave} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Nombre</label>
                            <input
                                name="name"
                                className="form-control"
                                value={form.name}
                                onChange={onChange}
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Apellidos</label>
                            <input
                                name="last_name"
                                className="form-control"
                                value={form.last_name}
                                onChange={onChange}
                                placeholder="Tus apellidos"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Correo electrónico</label>
                            <input className="form-control" value={form.email} disabled readOnly />
                            <div className="form-text">* El email no se modifica aquí.</div>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Teléfono móvil</label>
                            <input
                                name="phone"
                                className="form-control"
                                value={form.phone}
                                onChange={onChange}
                                placeholder="+56 9 1234 5678"
                            />
                            <div className="form-text">Formato internacional recomendado.</div>
                        </div>

                        <div className="col-12 d-flex gap-2 mt-2">
                            <button className="btn btn-success px-4" type="submit" disabled={saving}>
                                {saving ? "Guardando…" : "Guardar cambios"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => window.history.back()}
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>

                    <hr className="my-4" />

                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h6 className="text-muted mb-2">Eliminar cuenta</h6>
                            <div className="small text-muted">
                                Esta acción es permanente y no se puede deshacer.
                            </div>
                        </div>
                        <button
                            className="btn btn-outline-danger btn-sm"
                            type="button"
                            onClick={() => alert("Función pendiente")}
                        >
                            Eliminar permanentemente
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
