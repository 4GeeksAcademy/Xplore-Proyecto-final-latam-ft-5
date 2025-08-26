// src/front/pages/PanelReservation.jsx
import React from "react";
import { Link, useParams } from "react-router-dom";
import { getBookingById } from "../utils/bookings";

export default function PanelReservation() {
    const { bookingId } = useParams();
    const b = getBookingById(bookingId);

    if (!b) {
        return (
            <div className="alert alert-warning">
                No encontramos esta reserva.
                <div className="mt-2">
                    <Link to="/panel" className="btn btn-outline-secondary">Volver al Panel</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="card-soft">
            <h3 className="mb-2">Reserva #{b.confirmationCode || b.id}</h3>
            <div className="text-muted mb-3">{new Date(b.createdAt).toLocaleString()}</div>

            <div className="row g-4">
                <div className="col-md-6">
                    <h6 className="text-muted">Tour</h6>
                    <p className="mb-1">Título: <strong>{b.title || `Tour #${b.tourId}`}</strong></p>
                    <p className="mb-1">Fecha: <strong>{new Date(b.date).toLocaleDateString()}</strong></p>
                    <p className="mb-1">Pasajeros: <strong>{b.people}</strong></p>
                    {b.notes && <p className="mb-1">Observaciones: <em>{b.notes}</em></p>}
                </div>
                <div className="col-md-6">
                    <h6 className="text-muted">Pago</h6>
                    <p className="mb-1">Método: <strong>{b.paymentMethod || "card"}</strong></p>
                    <p className="fs-4 fw-bold mt-2">Total: ${b.total} USD</p>
                </div>
            </div>

            <hr className="hr-soft" />
            <div className="d-flex gap-2">
                <Link className="btn btn-outline-secondary" to="/panel">Volver al Panel</Link>
                <Link className="btn btn-primary" to={`/panel/booking/${b.tourId}/date`}>Reprogramar</Link>
            </div>
        </div>
    );
}
