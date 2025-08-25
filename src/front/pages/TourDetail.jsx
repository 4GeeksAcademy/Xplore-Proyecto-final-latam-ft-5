// src/front/pages/TourDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";

const FALLBACK = {
    id: 1,
    title: "Viaje de Escalada",
    price: 500,
    rating: 4.7,
    durationDays: 3,
    location: "Huaraz, Perú",
    description:
        "Una emocionante aventura de escalada en las montañas más desafiantes. Apta para todos los niveles, desde principiantes hasta expertos. Incluye equipo y guías certificados.",
    tags: ["aventura", "montaña"],
    organizer: {
        id: 11,
        name: "Andes Pro Guides",
        avatar: "https://i.pravatar.cc/80?img=12",
        bio: "Guías certificados UIAGM con más de 10 años de experiencia.",
    },
    photos: [
        "https://images.pexels.com/photos/314860/pexels-photo-314860.jpeg?auto=compress&cs=tinysrgb&w=1260",
        "https://images.pexels.com/photos/314860/pexels-photo-314860.jpeg?auto=compress&cs=tinysrgb&w=1260",
        "https://images.pexels.com/photos/314860/pexels-photo-314860.jpeg?auto=compress&cs=tinysrgb&w=1260",
    ],
    itinerary: [
        { day: 1, title: "Llegada y aclimatación" },
        { day: 2, title: "Ascenso y cumbre" },
        { day: 3, title: "Regreso y celebración" },
    ],
    includes: ["Guía certificado", "Equipo técnico", "Transporte local"],
    notIncluded: ["Vuelos", "Seguro de viaje", "Propinas"],
    nextStartDate: "2025-10-12",
    availableSpots: 8,
};

function BadgeList({ items = [] }) {
    return (
        <div className="mb-2">
            {items.map((t) => (
                <span key={t} className="badge bg-light text-secondary border me-1">
                    {t}
                </span>
            ))}
        </div>
    );
}

function Stars({ value = 0, max = 5 }) {
    const full = Math.round(value);
    return (
        <div className="text-warning" aria-label={`rating ${full}/${max}`}>
            {Array.from({ length: max }).map((_, i) => (
                <span key={i}>{i < full ? "★" : "☆"}</span>
            ))}
        </div>
    );
}

export const TourDetail = () => {
    const { tourId } = useParams();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar desde backend si existe, si no usar fallback
    useEffect(() => {
        const BASE = import.meta.env.VITE_BACKEND_URL;
        const load = async () => {
            setLoading(true);
            if (!BASE) {
                setTour({ ...FALLBACK, id: Number(tourId) || FALLBACK.id });
                setLoading(false);
                return;
            }
            try {
                // Ajusta al endpoint real: GET /api/tours/:id
                const res = await fetch(`${BASE}/api/tours/${tourId}`);
                if (!res.ok) throw new Error("bad status");
                const data = await res.json();
                setTour(data || FALLBACK);
            } catch {
                setTour({ ...FALLBACK, id: Number(tourId) || FALLBACK.id });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [tourId]);

    const cover = useMemo(
        () =>
            tour?.photos?.[0] ||
            "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1260",
        [tour]
    );

    if (loading) {
        return (
            <div className="container py-5 text-center text-muted">
                Cargando tour…
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="container py-5 text-center text-muted">
                No encontramos este tour.
            </div>
        );
    }

    return (
        <div className="container py-4">
            {/* Encabezado */}
            <div className="row g-4 align-items-center">
                <div className="col-lg-8">
                    <h1 className="fw-bold mb-2">{tour.title}</h1>
                    <div className="d-flex align-items-center gap-3 text-muted">
                        <Stars value={tour.rating} />
                        <span>· {tour.location}</span>
                        <span>· {tour.durationDays} días</span>
                    </div>
                </div>
                <div className="col-lg-4 text-lg-end">
                    <div className="fs-3 fw-bold">${tour.price} USD</div>
                    <div className="text-muted">por persona</div>
                </div>
            </div>

            {/* Galería */}
            <div className="row g-3 mt-3">
                <div className="col-lg-8">
                    <img
                        src={cover}
                        alt={tour.title}
                        className="img-fluid rounded shadow-sm w-100"
                        style={{ maxHeight: 420, objectFit: "cover" }}
                    />
                </div>
                <div className="col-lg-4">
                    <div className="row g-3">
                        {(tour.photos || []).slice(1, 3).map((src, i) => (
                            <div className="col-6 col-lg-12" key={i}>
                                <img
                                    src={src}
                                    alt={`${tour.title}-${i}`}
                                    className="img-fluid rounded shadow-sm w-100"
                                    style={{ height: 200, objectFit: "cover" }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info principal */}
            <div className="row g-4 mt-3">
                <div className="col-lg-8">
                    <BadgeList items={tour.tags || []} />
                    <p className="lead">{tour.description}</p>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Itinerario</h5>
                                    <ul className="mb-0">
                                        {(tour.itinerary || []).map((it) => (
                                            <li key={it.day}>
                                                <strong>Día {it.day}:</strong> {it.title}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Incluye</h5>
                                    <ul className="mb-3">
                                        {(tour.includes || []).map((x) => (
                                            <li key={x}>{x}</li>
                                        ))}
                                    </ul>

                                    <h6 className="card-subtitle mb-2 text-muted">No incluye</h6>
                                    <ul className="mb-0">
                                        {(tour.notIncluded || []).map((x) => (
                                            <li key={x}>{x}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TODO: mapa/ubicación (dejar placeholder) */}
                    <div className="card border-0 shadow-sm mt-3">
                        <div className="card-body">
                            <h5 className="card-title mb-2">Ubicación</h5>
                            <div className="text-muted">
                                {tour.location} — (Mapa embebido aquí más adelante)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar reserva / organizador */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-3">
                        <div className="d-flex align-items-center gap-3">
                            <img
                                src={tour.organizer?.avatar || "https://i.pravatar.cc/80"}
                                alt="organizer"
                                className="rounded-circle"
                                width="56"
                                height="56"
                            />
                            <div>
                                <div className="fw-bold">{tour.organizer?.name || "Organizador"}</div>
                                <div className="small text-muted">{tour.organizer?.bio || "…"}</div>
                            </div>
                        </div>

                        <hr />

                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <div className="fw-bold fs-5">${tour.price} USD</div>
                                <div className="small text-muted">por persona</div>
                            </div>
                            <div className="text-end small">
                                <div className="text-success">
                                    {tour.availableSpots} lugares disp.
                                </div>
                                <div className="text-muted">
                                    Próxima salida: {tour.nextStartDate}
                                </div>
                            </div>
                        </div>

                        <Link
                            to={`/panel/booking/${tour.id}/date`}
                            className="btn btn-success btn-lg w-100 mt-3"
                        >
                            Elegir fecha
                        </Link>

                        <button className="btn btn-outline-secondary w-100 mt-2">
                            Agregar a favoritos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
