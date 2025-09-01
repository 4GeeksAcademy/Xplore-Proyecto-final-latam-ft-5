// src/front/components/TourCard.jsx
import { useNavigate } from "react-router-dom";

function Stars({ value = 0, max = 5 }) {
    const full = Math.round(value);
    return (
        <div className="small text-warning" aria-label={`rating ${full}/${max}`}>
            {Array.from({ length: max }).map((_, i) => (
                <span key={i}>{i < full ? "★" : "☆"}</span>
            ))}
        </div>
    );
}

export default function TourCard({ tour, onToggleFav, isFav }) {
    const navigate = useNavigate();
    const cover =
        tour.photos?.[0] ||
        "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=800";

    const goDetail = () => {
        if (!tour?.id) return;
        navigate(`/tour/${tour.id}`);
    };

    return (
        <div
            className="card h-100 shadow-sm border-0 overflow-hidden"
            role="button"
            onClick={goDetail}
            style={{ cursor: "pointer" }}
        >
            <div className="position-relative">
                <img
                    src={cover}
                    alt={tour.title}
                    className="w-100"
                    style={{ height: 180, objectFit: "cover" }}
                />
                <button
                    type="button"
                    className={`btn btn-sm position-absolute top-0 end-0 m-2 rounded-pill ${isFav ? "btn-danger" : "btn-light"
                        }`}
                    onClick={(e) => {
                        e.stopPropagation(); // <- evita navegar al detalle
                        onToggleFav?.(tour.id);
                    }}
                    title={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                    {isFav ? "♥" : "♡"}
                </button>
            </div>

            <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between">
                    <h5 className="card-title mb-1">{tour.title}</h5>
                    <Stars value={tour.rating || 4.5} />
                </div>

                <p className="text-muted small mb-2">
                    {tour.location || "Ubicación por definir"} · {tour.durationDays || 3} días
                </p>

                <div className="mb-2">
                    {(tour.tags || ["aventura", "montaña"]).slice(0, 3).map((tag) => (
                        <span key={tag} className="badge bg-light text-secondary border me-1">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-auto d-flex align-items-end justify-content-between">
                    <div>
                        <div className="fw-bold">${tour.price || 500} USD</div>
                        <div className="small text-muted">por persona</div>
                    </div>

                    {/* Botón secundario que también navega, pero sin <Link> anidado */}
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={(e) => {
                            e.stopPropagation(); // <- evita que el onClick de la card también dispare
                            goDetail();
                        }}
                    >
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>
    );
}
