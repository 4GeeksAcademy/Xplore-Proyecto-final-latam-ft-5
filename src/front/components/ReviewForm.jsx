import { useState } from "react";
import { createReview } from "../utils/api";

// Componente de estrellas para el formulario
function StarInput({ value, onChange }) {
    const handleClick = (i) => onChange(i + 1);

    return (
        <div className="d-flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    className={i < value ? "text-warning" : "text-secondary"}
                    onClick={() => handleClick(i)}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

export function ReviewForm({ tourId, onReviewAdded }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return setError("Por favor selecciona una calificación");

        setLoading(true);
        setError("");
        try {

            const response = await createReview({ id: tourId, rating, comment })
            onReviewAdded?.(response); // para actualizar la lista de reviews en detalle
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRating(0);
            setComment("");
        }
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 p-3 mt-4">
            <h5>Deja tu review</h5>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="form-label">Calificación</label>
                    <StarInput value={rating} onChange={setRating} />
                </div>
                <div className="mb-2">
                    <label className="form-label">Comentario (opcional)</label>
                    <textarea
                        className="form-control"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                {error && <div className="text-danger mb-2">{error}</div>}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar review"}
                </button>
            </form>
        </div>
    );
}
