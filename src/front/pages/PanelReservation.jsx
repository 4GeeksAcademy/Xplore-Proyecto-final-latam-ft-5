import { useParams, Link } from "react-router-dom";
import { getBookings, cancelBooking } from "../utils/bookings";
import "../styles/panel.css";

export default function PanelReservation() {
    const { bookingId } = useParams();
    const bk = getBookings().find(b => b.id === bookingId);

    if (!bk) {
        return (
            <div className="container py-4">
                <p>No se encontró la reserva.</p>
                <Link to="/panel" className="btn btn-outline-primary">Volver</Link>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card-soft">
                        <h3 className="mb-1">{bk.title}</h3>
                        <div className="text-muted mb-2">
                            {new Date(bk.date).toLocaleString()} • {bk.people || 1} pasajero(s)
                        </div>
                        <pre className="bg-light p-3 rounded small">{JSON.stringify(bk, null, 2)}</pre>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-secondary" onClick={() => alert("Reprogramar (mock)")}>Reprogramar</button>
                            <button className="btn btn-outline-danger" onClick={() => { cancelBooking(bk.id); location.href = "/panel"; }}>Cancelar</button>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card-soft">
                        <div className="fw-semibold mb-2">Resumen</div>
                        <div className="d-flex justify-content-between">
                            <span>Método</span><span className="fw-semibold">{bk.paymentMethod}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Total</span><span className="fw-bold">${bk.total} USD</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Código</span><span className="badge-soft">{bk.confirmationCode}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
