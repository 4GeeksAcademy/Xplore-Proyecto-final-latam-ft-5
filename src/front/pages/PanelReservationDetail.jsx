// src/front/pages/PanelReservationDetail.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    getBookings,
    cancelBooking,
    BOOKINGS_UPDATED_EVENT,
} from "../utils/bookings";
import "../styles/panel.css";

function formatDateSafe(value) {
    const d = new Date(value);
    return d.toString() === "Invalid Date" ? "Fecha no disponible" : d.toLocaleString();
}

export default function PanelReservationDetail() {
    const { id } = useParams();
    const nav = useNavigate();
    const [booking, setBooking] = useState(null);

    const load = useCallback(() => {
        const all = getBookings() || [];
        const found = all.find((b) => String(b.id) === String(id)) || null;
        setBooking(found);
    }, [id]);

    useEffect(() => {
        load(); // al montar y cuando cambie :id
    }, [load]);

    useEffect(() => {
        // refrescar si otras pantallas agregan/cancelan reservas
        const onUpd = () => load();
        window.addEventListener(BOOKINGS_UPDATED_EVENT, onUpd);
        return () => window.removeEventListener(BOOKINGS_UPDATED_EVENT, onUpd);
    }, [load]);

    if (!booking) {
        return (
            <div className="container py-4">
                <div className="alert alert-warning">Reserva no encontrada.</div>
                <button className="btn btn-outline-secondary" onClick={() => nav(-1)}>
                    Volver
                </button>
            </div>
        );
    }

    const when = formatDateSafe(booking.date);

    const onCancel = () => {
        if (!window.confirm("¿Seguro que quieres cancelar esta reserva?")) return;
        cancelBooking(booking.id);
        // volver al panel de reservas
        nav("/panel");
    };

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="m-0">{booking.title || `Tour #${booking.tourId}`}</h3>
                <span
                    className={`badge ${booking.status === "reserved" ? "text-bg-success" : "text-bg-secondary"
                        }`}
                >
                    {booking.status}
                </span>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card-soft p-3">
                        <dl className="row mb-0">
                            <dt className="col-sm-4">Fecha</dt>
                            <dd className="col-sm-8">{when}</dd>

                            <dt className="col-sm-4">Pasajeros</dt>
                            <dd className="col-sm-8">{booking.people || 1}</dd>

                            <dt className="col-sm-4">Notas</dt>
                            <dd className="col-sm-8">{booking.notes || "—"}</dd>
                        </dl>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card-soft p-3">
                        <h6 className="mb-3">Resumen</h6>

                        <div className="d-flex justify-content-between">
                            <span>Método</span>
                            <strong>{booking.paymentMethod || "—"}</strong>
                        </div>

                        <div className="d-flex justify-content-between">
                            <span>Total</span>
                            <strong>${booking.total || 0} USD</strong>
                        </div>

                        {booking.confirmationCode && (
                            <div className="d-flex justify-content-between">
                                <span>Código</span>
                                <span className="badge text-bg-success">
                                    {booking.confirmationCode}
                                </span>
                            </div>
                        )}

                        <div className="d-grid gap-2 mt-3">
                            <Link className="btn btn-primary" to={`/tour/${booking.tourId}`}>
                                Ver tour
                            </Link>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => alert("Reprogramar (mock)")}
                            >
                                Reprogramar
                            </button>
                            <button className="btn btn-outline-danger" onClick={onCancel}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
