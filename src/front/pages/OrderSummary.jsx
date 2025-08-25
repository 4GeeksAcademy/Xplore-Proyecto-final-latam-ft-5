// src/front/pages/OrderSummary.jsx
import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getCheckout, saveCheckout } from "../utils/checkout";
import "../styles/checkout.css";

export default function OrderSummary() {
    const { tourId } = useParams();
    const nav = useNavigate();
    const ck = getCheckout();

    const goConfirm = () => {
        // Aquí iría tu POST real al backend
        const code = "XP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
        saveCheckout({ confirmationCode: code });
        nav(`/panel/booking/${tourId}/success`, { replace: true });
    };

    // 👇 Botón de prueba: simular transferencia desde el resumen
    const simulateTransfer = () => {
        const code = "TRF-" + Math.random().toString(36).slice(2, 8).toUpperCase();
        saveCheckout({
            payment: { method: "bank_transfer", name: "Transferencia bancaria (simulada)" },
            confirmationCode: code,
        });
        nav(`/panel/booking/${tourId}/success`, { replace: true });
    };

    if (!ck.date || !ck.payment) {
        return (
            <div className="checkout-wrap">
                <div className="alert alert-warning">
                    Falta información del checkout. Vuelve al paso anterior.
                </div>
                <Link to={`/panel/booking/${tourId}/date`} className="btn btn-outline-secondary">Ir a fechas</Link>
            </div>
        );
    }

    return (
        <div className="checkout-wrap">
            <div className="stepper">
                <span className="dot active">1</span><span className="bar active" />
                <span className="dot active">2</span><span className="bar active" />
                <span className="dot active">3</span><span className="bar active" />
                <span className="dot">4</span>
            </div>

            <div className="card-soft">
                <h3>Revisa tu reserva</h3>
                <hr className="hr-soft" />

                <div className="row g-4">
                    <div className="col-md-6">
                        <h6 className="text-muted">Datos del tour</h6>
                        <p className="mb-1">Tour: <strong>#{ck.tourId}</strong></p>
                        <p className="mb-1">Fecha: <strong>{ck.date}</strong></p>
                        <p className="mb-1">Pasajeros: <strong>{ck.people}</strong></p>
                        {ck.notes && <p className="mb-1">Observaciones: <em>{ck.notes}</em></p>}
                    </div>

                    <div className="col-md-6">
                        <h6 className="text-muted">Pago</h6>
                        <p className="mb-1">Método: <strong>{ck.payment?.method || "card"}</strong></p>
                        <p className="mb-1">Titular: <strong>{ck.payment?.name}</strong></p>
                        <p className="mb-1">País: <strong>{ck.payment?.country || "—"}</strong></p>
                        <p className="mb-1">Extras:
                            {" "}
                            {ck.extras?.insurance ? "Seguro " : ""}
                            {ck.extras?.equipment ? "Equipo " : ""}
                            {!ck.extras?.insurance && !ck.extras?.equipment ? "—" : ""}
                        </p>
                        <p className="fs-5 mt-2">Total: <strong>${ck.total} USD</strong></p>
                    </div>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-3">
                    <Link to={`/panel/booking/${tourId}/payment`} className="btn btn-outline-secondary">Volver</Link>
                    <button className="btn btn-success" onClick={goConfirm}>Confirmar y pagar</button>

                    {/* 👇 Simular transferencia directa desde el resumen */}
                    <button type="button" className="btn btn-warning ms-auto" onClick={simulateTransfer}>
                        Simular transferencia (directo a éxito)
                    </button>
                </div>
            </div>
        </div>
    );
}
