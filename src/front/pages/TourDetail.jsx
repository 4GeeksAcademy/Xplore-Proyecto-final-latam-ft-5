import { useParams, Link } from "react-router-dom";
import { isFavorite, toggleFavorite } from "../utils/favorites";

const mock = id => ({
    id,
    title: id === "2" ? "Antropología Mística" : id === "3" ? "Viaje a Chile" : "Viaje de Escalada",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    gallery: [
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop"
    ],
    city: "Huaraz, Perú",
    days: 3,
    price: 450,
    rating: 4.7,
    organizer: { name: "Con Jennifer", avatar: "https://i.pravatar.cc/96" },
    description:
        "Una emocionante aventura por montañas icónicas. Incluye equipo, guías certificados y transporte local. Apta para distintos niveles con grupos reducidos."
});

export function TourDetail() {
    const { tourId } = useParams();
    const data = mock(tourId);
    const fav = isFavorite(tourId);

    return (
        <div className="container py-4">
            {/* HERO */}
            <div className="row g-4">
                <div className="col-lg-8">
                    <img className="img-fluid rounded-4 shadow-sm" src={data.cover} alt={data.title} />
                </div>
                <div className="col-lg-4">
                    <div className="card-soft h-100">
                        <h2 className="fw-bold">{data.title}</h2>
                        <div className="text-muted">{data.city} • {data.days} días</div>
                        <div className="d-flex align-items-center gap-1 text-warning my-2">
                            {"★".repeat(5)} <small className="text-muted ms-1">{data.rating}</small>
                        </div>
                        <p className="mb-2">{data.description}</p>

                        <div className="d-flex align-items-center gap-3 my-3">
                            <img src={data.organizer.avatar} className="rounded-circle" width={44} height={44} />
                            <div>
                                <div className="fw-semibold">Organiza</div>
                                <div className="text-muted small">{data.organizer.name}</div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <div className="fs-3 fw-bold">${data.price} USD</div>
                            <div className="d-flex gap-2">
                                <button
                                    className={`btn ${fav ? "btn-warning" : "btn-outline-secondary"}`}
                                    onClick={() => { toggleFavorite(tourId); location.reload(); }}
                                >
                                    {fav ? "✓ Favorito" : "♥ Favorito"}
                                </button>
                                <Link className="btn btn-primary" to={`/panel/booking/${tourId}/date`}>Reservar</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GALERÍA */}
            <div className="row g-3 mt-3">
                {data.gallery.map((src, i) => (
                    <div key={i} className="col-4">
                        <img className="img-fluid rounded-3" src={src} alt={`gal-${i}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}
