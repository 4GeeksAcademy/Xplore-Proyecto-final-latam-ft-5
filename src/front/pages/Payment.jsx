import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function Payment() {
    const { tourId } = useParams();
    const { state } = useLocation(); // { date }
    const nav = useNavigate();
    const [method, setMethod] = useState("card");
    const [card, setCard] = useState("");

    function confirm(e) {
        e.preventDefault();
        alert(`Reserva confirmada\nTour: ${tourId}\nFecha: ${state?.date}\nMétodo: ${method}`);
        nav("/panel", { replace: true });
    }

    return (
        <div className="col-md-6">
            <h3>Método de pago</h3>
            <form onSubmit={confirm} className="d-grid gap-2">
                <select className="form-select" value={method} onChange={e => setMethod(e.target.value)}>
                    <option value="card">Tarjeta</option>
                    <option value="transfer">Transferencia</option>
                </select>
                {method === "card" && (
                    <input className="form-control" placeholder="Número de tarjeta"
                        value={card} onChange={e => setCard(e.target.value)} />
                )}
                <button className="btn btn-primary" type="submit">Pagar y reservar</button>
            </form>
        </div>
    );
}
