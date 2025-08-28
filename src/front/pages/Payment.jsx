import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { setCheckout, getCheckout } from "../utils/checkout";
import "../styles/checkout.css";

export default function Payment() {
    const { tourId } = useParams();
    const nav = useNavigate();
    const ck = getCheckout();

    const [name, setName] = useState("");
    const [method, setMethod] = useState("card"); // card | transfer
    const [card, setCard] = useState("");
    const [total] = useState(ck.people ? 100 * ck.people : 100); // demo

    function confirm() {
        setCheckout({
            payment: { method, name, cardLast: card.slice(-4) },
            total,
            confirmationCode: (method === "transfer" ? "TRF-" : "PAY-") + Math.random().toString(36).slice(2, 8).toUpperCase(),
        });
        nav(`/panel/booking/${tourId}/success`, { replace: true });
    }

    return (
        <div className="checkout-wrap">
            <div className="stepper">
                <span className="dot active">1</span><span className="bar active" /><span className="dot active">2</span><span className="bar" /><span className="dot">3</span><span className="bar" /><span className="dot">4</span>
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card-soft">
                        <h3 className="mb-3">Pago</h3>
                        <p className="text-muted mb-3">
                            Tour: {ck.tourTitle || `#${tourId}`} • Fecha: {ck.date || "—"} • Pasajeros: {ck.people || 1}
                        </p>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Titular</label>
                                <input className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre como aparece en la tarjeta" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Método</label>
                                <select className="form-select" value={method} onChange={e => setMethod(e.target.value)}>
                                    <option value="card">Tarjeta</option>
                                    <option value="transfer">Transferencia (prueba)</option>
                                </select>
                            </div>

                            {method === "card" && (
                                <>
                                    <div className="col-md-8">
                                        <label className="form-label">N° Tarjeta</label>
                                        <input className="form-control" placeholder="4111 1111 1111 1111" value={card} onChange={e => setCard(e.target.value)} />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">MM/AA</label>
                                        <input className="form-control" placeholder="12/28" />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">CVC</label>
                                        <input className="form-control" placeholder="123" />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="fs-5 fw-bold">Total: ${total} USD</div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-success" onClick={confirm}>Confirmar pago</button>
                                <button className="btn btn-outline-primary" onClick={() => { setMethod("transfer"); confirm(); }}>
                                    Probar transferencia
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="summary">
                        <div className="fw-semibold mb-1">Resumen</div>
                        <div className="small text-muted">Tour #{tourId}</div>
                        <div className="small">Fecha: <strong>{ck.date || "—"}</strong></div>
                        <div className="small">Pasajeros: <strong>{ck.people || 1}</strong></div>
                        <div className="small mt-2">Método: <strong>{method}</strong></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
