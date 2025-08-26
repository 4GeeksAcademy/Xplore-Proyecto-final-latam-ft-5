import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getCheckout, clearCheckout } from "../utils/checkout";
import { addBooking } from "../utils/bookings";
import "../styles/checkout.css";

export default function BookingSuccess() {
    const { tourId } = useParams();
    const ck = getCheckout();

    useEffect(() => {
        if (!ck?.date || !ck?.total) return;
        const saved = addBooking({
            tourId,
            title: ck.tourTitle || `Tour #${tourId}`,
            date: ck.date,
            people: ck.people,
            extras: ck.extras || {},
            total: ck.total,
            paymentMethod: ck.payment?.method || "card",
            confirmationCode: ck.confirmationCode,
            notes: ck.notes || "",
        });
        sessionStorage.setItem("xplora_just_booked", JSON.stringify({
            bookingId: saved.id, tourId: saved.tourId, title: saved.title, date: saved.date,
        }));
    }, []);

    function handleFinish() { clearCheckout(); }

    return (
        <div className="checkout-wrap text-center">
            <div className="stepper">
                <span className="dot active">1</span><span className="bar active" />
                <span className="dot active">2</span><span className="bar active" />
                <span className="dot active">3</span><span className="bar active" />
                <span className="dot active">4</span>
            </div>

            <div className="card-soft">
                <h2 className="mb-2">🎉 ¡Reserva confirmada!</h2>
                <p className="text-muted">Gracias por reservar con Xplora.</p>

                <div className="mt-3">
                    <div className="badge-soft d-inline-block">
                        Código: {ck.confirmationCode || "—"}
                    </div>
                </div>

                <div className="row g-4 mt-2 text-start">
                    <div className="col-md-6">
                        <h6 className="text-muted">Detalles</h6>
                        <p className="mb-1">Tour: {ck.tourTitle || `#${tourId}`}</p>
                        <p className="mb-1">Fecha: {ck.date}</p>
                        <p className="mb-1">Pasajeros: {ck.people}</p>
                        {ck.notes && <p className="mb-1">Observaciones: <em>{ck.notes}</em></p>}
                    </div>
                    <div className="col-md-6">
                        <h6 className="text-muted">Pago</h6>
                        <p className="mb-1">Método: <strong>{ck.payment?.method || "card"}</strong></p>
                        <p className="mb-1">Titular: <strong>{ck.payment?.name || "—"}</strong></p>
                        <p className="fs-4 fw-bold mt-2">Total: ${ck.total || 0} USD</p>
                    </div>
                </div>

                <hr className="hr-soft" />
                <div className="d-flex gap-2 justify-content-center">
                    <Link to="/panel" onClick={handleFinish} className="btn btn-primary">Ir a mi Panel</Link>
                    <Link to="/" onClick={handleFinish} className="btn btn-outline-secondary">Ir al Home</Link>
                </div>
            </div>
        </div>
    );
}
