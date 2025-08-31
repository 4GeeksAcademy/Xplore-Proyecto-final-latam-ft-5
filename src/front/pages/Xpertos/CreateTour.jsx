// src/front/pages/Xpertos/CreateTour.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/auth";
import { createTour } from "../../utils/apiTours";

export default function CreateTour() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) {
            navigate("/login-xpertos", { replace: true, state: { from: "/panel/tours/create" } });
        }
    }, [navigate]);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const [sending, setSending] = useState(false);
    const [err, setErr] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        if (!title || !location || !price) {
            setErr("Completa título, ubicación y precio.");
            return;
        }
        try {
            setSending(true);
            const data = await createTour({
                title: title.trim(),
                location: location.trim(),
                price: Number(price),
                description: description.trim(),
            });
            if (data?.id) {
                navigate(`/panel/tours/${data.id}`, { replace: true });
            } else {
                navigate("/panel/tours", { replace: true });
            }
        } catch (e2) {
            setErr(e2.message || "No se pudo crear el tour.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="container py-3">
            <h3 className="mb-3">Crea tu primer tour</h3>
            {err && <div className="alert alert-danger">{err}</div>}

            <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Ubicación</label>
                    <input className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input type="number" min="0" step="0.01" className="form-control"
                        value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" rows={4}
                        value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <button className="btn btn-primary" disabled={sending}>
                    {sending ? "Creando..." : "Crear tour"}
                </button>
            </form>
        </div>
    );
}
