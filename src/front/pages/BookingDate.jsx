// src/front/pages/BookingDate.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { saveCheckout, getCheckout } from "../utils/checkout";
import "../styles/checkout.css";

export default function BookingDate() {
    const { tourId } = useParams();
    const nav = useNavigate();

    // Valores mock; más tarde los traes del backend
    const BASE_PRICE = 500;

    const prev = getCheckout();
    const [date, setDate] = useState(prev.date || "");
    const [people, setPeople] = useState(prev.people || 1);
    const [notes, setNotes] = useState(prev.notes || "");
    const [error, setError] = useState("");

    useEffect(() => {
        // Guarda tourId y basePrice para los siguientes pasos
        saveCheckout({ tourId, basePrice: BASE_PRICE });
    }, [tourId]);

    function submit(e) {
        e.preventDefault();
        if (!date) return setError("Selecciona una fecha.");
        if (people < 1) return setError("Debe haber al menos 1 pasajero.");

        saveCheckout({ date, people: Number(people), notes });
        nav(`/panel/booking/${tourId}/payment`, { replace: true });
    }

    return (
        <div className="checkout-wrap">
            <div className="stepper">
                <span className="dot active">1</span><span className="bar active" />
                <span className="dot">2</span><span className="bar" />
                <span className="dot">3</span><span className="bar" />
                <span className="dot">4</span>
            </div>

            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="card-soft">
                        <h3 className="mb-3">Selecciona tu fecha</h3>
                        <form onSubmit={submit} className="vstack gap-3">
                            <div>
                                <label className="form-label fw-semibold">Fecha del tour</label>
                                <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
                            </div>

                            <div>
                                <label className="form-label fw-semibold">Pasajeros</label>
                                <input type="number" min="1" className="form-control" value={people} onChange={e => setPeople(e.target.value)} />
                            </div>

                            <div>
                                <label className="form-label fw-semibold">Observaciones</label>
                                <textarea className="form-control" rows="4"
                                    placeholder="Alergias, movilidad, idiomas, horarios, etc."
                                    value={notes} onChange={e => setNotes(e.target.value)} />
                            </div>

                            {error && <div className="alert alert-danger py-2">{error}</div>}

                            <div className="d-flex gap-2">
                                <Link to="/panel" className="btn btn-outline-secondary">Cancelar</Link>
                                <button className="btn btn-success">Continuar con el pago</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card-soft summary-sticky">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="m-0">Resumen</h5>
                            <span className="badge-soft">Tour #{tourId}</span>
                        </div>
                        <hr className="hr-soft" />
                        <div className="d-flex justify-content-between">
                            <span>Precio base</span>
                            <span className="fw-bold">${BASE_PRICE} USD</span>
                        </div>
                        <div className="text-muted small mt-2">
                            * El total final se calculará según la cantidad de pasajeros y extras.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
