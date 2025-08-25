// src/front/pages/Payment.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getCheckout, saveCheckout } from "../utils/checkout";
import "../styles/checkout.css";

export default function Payment() {
    const { tourId } = useParams();
    const nav = useNavigate();
    const ck = getCheckout();

    useEffect(() => {
        if (!ck.date || !ck.people) nav(`/panel/booking/${tourId}/date`, { replace: true });
    }, []);

    // Extras
    const [insurance, setInsurance] = useState(ck.extras?.insurance || false);
    const [equipment, setEquipment] = useState(ck.extras?.equipment || false);

    // Formulario de tarjeta (demo)
    const [card, setCard] = useState({
        name: ck.payment?.name || "",
        number: ck.payment?.number || "",
        exp: ck.payment?.exp || "",
        cvv: ck.payment?.cvv || "",
        country: ck.payment?.country || "MX",
    });
    const [error, setError] = useState("");

    const breakdown = useMemo(() => {
        const base = (ck.basePrice || 500) * (ck.people || 1);
        const ins = insurance ? 10 * (ck.people || 1) : 0;
        const eq = equipment ? 30 * (ck.people || 1) : 0;
        const total = base + ins + eq;
        return { base, ins, eq, total };
    }, [ck.basePrice, ck.people, insurance, equipment]);

    function onPay(e) {
        e.preventDefault();
        if (!card.name || !card.number || !card.exp || !card.cvv) {
            return setError("Completa los datos de la tarjeta.");
        }
        if (card.number.replace(/\s/g, "").length < 12) {
            return setError("Número de tarjeta inválido.");
        }
        saveCheckout({
            extras: { insurance, equipment },
            payment: { ...card, method: "card" },   // 👈 método tarjeta
            total: breakdown.total,
        });
        nav(`/panel/booking/${tourId}/summary`, { replace: true });
    }

    // 👇 Botón de prueba: pago por transferencia que va directo a éxito
    function payByTransfer() {
        saveCheckout({
            extras: { insurance, equipment },
            payment: {
                method: "bank_transfer",
                name: "Transferencia bancaria (simulada)",
            },
            total: breakdown.total,
            confirmationCode: "TRF-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        });
        nav(`/panel/booking/${tourId}/success`, { replace: true });
    }

    return (
        <div className="checkout-wrap">
            <div className="stepper">
                <span className="dot active">1</span><span className="bar active" />
                <span className="dot active">2</span><span className="bar active" />
                <span className="dot">3</span><span className="bar" />
                <span className="dot">4</span>
            </div>

            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="card-soft">
                        <h3 className="mb-3">Pago</h3>
                        <form className="vstack gap-3" onSubmit={onPay}>
                            <div className="row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-semibold">Nombre en la tarjeta</label>
                                    <input className="form-control" value={card.name}
                                        onChange={e => setCard({ ...card, name: e.target.value })} />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-semibold">Número</label>
                                    <input className="form-control" inputMode="numeric" placeholder="XXXX XXXX XXXX XXXX"
                                        value={card.number}
                                        onChange={e => setCard({ ...card, number: e.target.value })} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label fw-semibold">Vencimiento (MM/AA)</label>
                                    <input className="form-control" placeholder="MM/AA"
                                        value={card.exp}
                                        onChange={e => setCard({ ...card, exp: e.target.value })} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label fw-semibold">CVV</label>
                                    <input className="form-control" inputMode="numeric"
                                        value={card.cvv}
                                        onChange={e => setCard({ ...card, cvv: e.target.value })} />
                                </div>
                            </div>

                            <div className="mt-2">
                                <label className="form-label fw-semibold">País</label>
                                <select className="form-select" value={card.country} onChange={e => setCard({ ...card, country: e.target.value })}>
                                    <option value="MX">México</option>
                                    <option value="CL">Chile</option>
                                    <option value="AR">Argentina</option>
                                    <option value="CO">Colombia</option>
                                    <option value="US">Estados Unidos</option>
                                </select>
                            </div>

                            <hr className="hr-soft" />
                            <div className="vstack gap-2">
                                <label className="form-check">
                                    <input className="form-check-input" type="checkbox"
                                        checked={insurance} onChange={e => setInsurance(e.target.checked)} />
                                    <span className="form-check-label">Seguro de viaje (+$10 por persona)</span>
                                </label>
                                <label className="form-check">
                                    <input className="form-check-input" type="checkbox"
                                        checked={equipment} onChange={e => setEquipment(e.target.checked)} />
                                    <span className="form-check-label">Renta de equipo (+$30 por persona)</span>
                                </label>
                            </div>

                            {error && <div className="alert alert-danger py-2">{error}</div>}

                            <div className="d-flex flex-wrap gap-2">
                                <Link to={`/panel/booking/${tourId}/date`} className="btn btn-outline-secondary">Volver</Link>
                                <button className="btn btn-success">Revisar resumen</button>

                                {/* 👇 Botón de prueba: transferencia directa a éxito */}
                                <button
                                    type="button"
                                    className="btn btn-warning ms-auto"
                                    onClick={payByTransfer}
                                    title="Simular pago por transferencia (va directo a éxito)"
                                >
                                    Pagar por transferencia (simulado)
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card-soft summary-sticky">
                        <h5 className="mb-2">Resumen</h5>
                        <div className="d-flex justify-content-between"><span>Base x{ck.people}</span><strong>${breakdown.base} USD</strong></div>
                        <div className="d-flex justify-content-between"><span>Seguro</span><strong>${breakdown.ins} USD</strong></div>
                        <div className="d-flex justify-content-between"><span>Equipo</span><strong>${breakdown.eq} USD</strong></div>
                        <hr className="hr-soft" />
                        <div className="d-flex justify-content-between fs-5"><span>Total</span><strong>${breakdown.total} USD</strong></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
