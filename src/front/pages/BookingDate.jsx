import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setCheckout } from "../utils/checkout";
import "../styles/checkout.css";

export default function BookingDate() {
    const { tourId } = useParams();
    const nav = useNavigate();

    const [date, setDate] = useState("");
    const [people, setPeople] = useState(1);
    const [notes, setNotes] = useState("");

    function goPayment() {
        if (!date) return alert("Selecciona una fecha");
        setCheckout({
            tourTitle: `Tour #${tourId}`,
            date,
            dateISO: new Date(date).toISOString(),
            people,
            notes,
        });
        nav(`/panel/booking/${tourId}/payment`);
    }

    return (
        <div className="checkout-wrap">
            <div className="stepper">
                <span className="dot active">1</span><span className="bar" /><span className="dot">2</span><span className="bar" /><span className="dot">3</span><span className="bar" /><span className="dot">4</span>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card-soft">
                        <h3 className="mb-3">Selecciona fecha y pasajeros</h3>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Fecha</label>
                                <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Pasajeros</label>
                                <input type="number" min={1} className="form-control" value={people} onChange={e => setPeople(+e.target.value)} />
                            </div>
                            <div className="col-12">
                                <label className="form-label">Observaciones</label>
                                <textarea rows={3} className="form-control" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Dietas, restricciones, hora de recogida…" />
                            </div>
                        </div>

                        <div className="mt-3 d-flex justify-content-end">
                            <button className="btn btn-primary" onClick={goPayment}>Continuar a pago</button>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="summary">
                        <div className="fw-semibold mb-1">Resumen</div>
                        <div className="small text-muted">Tour #{tourId}</div>
                        <div className="small">Fecha: <strong>{date || "—"}</strong></div>
                        <div className="small">Pasajeros: <strong>{people}</strong></div>
                    </div>
                    <small className="text-muted d-block mt-2">
                        Recibirás confirmación por correo y en tu Panel.
                    </small>
                </div>
            </div>
        </div>
    );
}
