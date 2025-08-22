import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export default function BookingDate() {
    const { tourId } = useParams();
    const nav = useNavigate();
    const [date, setDate] = useState("");

    function goNext(e) {
        e.preventDefault();
        if (!date) return;
        nav(`/panel/booking/${tourId}/payment`, { state: { date } });
    }

    return (
        <div className="col-md-6">
            <h3>Selecciona fecha</h3>
            <form onSubmit={goNext} className="d-grid gap-2">
                <input className="form-control" type="date"
                    value={date} onChange={e => setDate(e.target.value)} required />
                <button className="btn btn-success" type="submit">Continuar</button>
            </form>
        </div>
    );
}
