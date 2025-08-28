// src/front/pages/TourDetail.jsx
import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { isFavorite, toggleFavorite } from "../utils/favorites";

/** ------- Mock de datos (igual que el tuyo, ampliado un poco) ------- */
const mock = (id) => ({
    id,
    title:
        id === "2"
            ? "Antropología Mística"
            : id === "3"
                ? "Viaje a Chile"
                : "Viaje de Escalada",
    cover:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    gallery: [
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop",
    ],
    city: "Huaraz, Perú",
    days: id === "3" ? 5 : id === "2" ? 2 : 3,
    price: id === "3" ? 520 : id === "2" ? 380 : 450,
    rating: id === "2" ? 4.5 : id === "3" ? 4.8 : 4.7,
    organizer: { name: "Con Jennifer", avatar: "https://i.pravatar.cc/96" },
    description:
        "Una emocionante aventura por montañas icónicas. Incluye equipo, guías certificados y transporte local. Apta para distintos niveles con grupos reducidos.",
    highlights: [
        "Grupos reducidos (máx. 10 pax)",
        "Equipo técnico incluido",
        "Guías certificados UIAGM",
        "Transporte local y apoyo 24/7",
    ],
    included: ["Guía certificado", "Transporte local", "Equipo básico", "Snack y agua"],
    notIncluded: ["Vuelos", "Seguro de viaje", "Propinas", "Alimentación completa"],
    itinerary: [
        { title: "Día 1", text: "Llegada y aclimatación. Caminata ligera y briefing." },
        { title: "Día 2", text: "Ascenso principal, vistas panorámicas y lagunas." },
        { title: "Día 3", text: "Cumbre opcional y regreso a la ciudad." },
    ],
});

/* ================================
     Carga desde API por ID (comentada)
     ================================
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const tour = await apiTourById(tourId);
        if (!abort) setData(tour);
      } catch (e) {
        if (!abort) {
          setError(e.message || "No se pudo cargar el tour");
          setData(mock(tourId)); // fallback
        }
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => { abort = true; };
  }, [tourId]);
  */





/** ------- Componentes auxiliares ------- */
function StarRating({ value = 0 }) {
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    return (
        <div className="d-flex align-items-center gap-1 text-warning" title={`${value} / 5`}>
            {Array.from({ length: full }).map((_, i) => (
                <span key={`f${i}`}>★</span>
            ))}
            {half && <span>☆</span>}
            {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
                <span key={`e${i}`} className="text-secondary">
                    ★
                </span>
            ))}
            <small className="text-muted ms-1">{value.toFixed(1)}</small>
        </div>
    );
}

function Chip({ children }) {
    return <span className="badge rounded-pill text-bg-light me-2">{children}</span>;
}

function GalleryCarousel({ images, id = "tourGallery" }) {
    if (!images?.length) return null;
    return (
        <div id={id} className="carousel slide rounded-4 overflow-hidden shadow-sm">
            <div className="carousel-inner">
                {images.map((src, i) => (
                    <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                        <img src={src} className="d-block w-100" alt={`gal-${i}`} />
                    </div>
                ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target={`#${id}`} data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">Anterior</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target={`#${id}`} data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">Siguiente</span>
            </button>
        </div>
    );
}

/** ------- Vista principal ------- */
export function TourDetail() {
    const nav = useNavigate();
    const { tourId } = useParams();
    const data = useMemo(() => mock(tourId), [tourId]);

    // Estado de favorito sin recargar
    const [fav, setFav] = useState(isFavorite(data.id));

    const handleFav = () => {
        toggleFavorite({
            id: data.id,
            title: data.title,
            cover: data.cover,   // será normalizado a image
            city: data.city,     // será normalizado a location
            tags: data.highlights, // o data.tags si tienes
            price: data.price,
        });
        setFav(isFavorite(data.id));
    };


    const handleShare = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title: data.title, text: data.city, url });
            } else {
                await navigator.clipboard.writeText(url);
                alert("Enlace copiado al portapapeles");
            }
        } catch {
            // silencio está bien para UX
        }
    };

    return (
        <div className="container py-4">
            {/* Migas + volver */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="text-muted small">
                    <Link to="/" className="text-decoration-none">Inicio</Link> /{" "}
                    <Link to="/tours" className="text-decoration-none">Tours</Link> /{" "}
                    <span className="text-secondary">{data.title}</span>
                </div>
                <button className="btn btn-link text-decoration-none" onClick={() => nav(-1)}>
                    ← Volver
                </button>
            </div>

            {/* ======= Layout horizontal: imagen/carousel + card de booking sticky ======= */}
            <div className="row g-4">
                {/* Col izquierda: media y contenido */}
                <div className="col-lg-8">
                    {/* Cover y chips */}
                    <div className="rounded-4 overflow-hidden shadow-sm mb-3">
                        <img className="img-fluid w-100" src={data.cover} alt={data.title} />
                    </div>

                    <div className="d-flex flex-wrap align-items-center mb-2">
                        <Chip>{data.city}</Chip>
                        <Chip>{data.days} días</Chip>
                        <Chip>Grupos reducidos</Chip>
                        <Chip>Guía certificado</Chip>
                    </div>

                    <h1 className="h3 fw-bold mb-1">{data.title}</h1>
                    <StarRating value={data.rating} />

                    <div className="d-flex align-items-center gap-3 my-3">
                        <img
                            src={data.organizer.avatar}
                            className="rounded-circle border"
                            width={48}
                            height={48}
                            alt="organizer"
                        />
                        <div className="small">
                            <div className="fw-semibold">Organiza</div>
                            <div className="text-muted">{data.organizer.name}</div>
                        </div>
                    </div>

                    {/* Destacados */}
                    <div className="card border-0 shadow-sm rounded-4 p-3 mb-3">
                        <h5 className="mb-2">Lo que más gusta</h5>
                        <ul className="mb-0">
                            {data.highlights.map((h, i) => (
                                <li key={i}>{h}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Descripción + acordeón de itinerario */}
                    <div className="card border-0 shadow-sm rounded-4 p-3 mb-3">
                        <h5 className="mb-2">Descripción</h5>
                        <p className="mb-0">{data.description}</p>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 p-3 mb-3">
                        <h5 className="mb-3">Itinerario</h5>
                        <div className="accordion" id="itineraryAcc">
                            {data.itinerary.map((d, i) => (
                                <div className="accordion-item" key={i}>
                                    <h2 className="accordion-header" id={`h${i}`}>
                                        <button
                                            className={`accordion-button ${i !== 0 ? "collapsed" : ""}`}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#c${i}`}
                                            aria-expanded={i === 0}
                                            aria-controls={`c${i}`}
                                        >
                                            {d.title}
                                        </button>
                                    </h2>
                                    <div
                                        id={`c${i}`}
                                        className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                                        aria-labelledby={`h${i}`}
                                        data-bs-parent="#itineraryAcc"
                                    >
                                        <div className="accordion-body">{d.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Incluye / No incluye */}
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                <h5 className="mb-2">Incluye</h5>
                                <ul className="mb-0">
                                    {data.included.map((i, idx) => (
                                        <li key={idx}>✅ {i}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                <h5 className="mb-2">No incluye</h5>
                                <ul className="mb-0">
                                    {data.notIncluded.map((i, idx) => (
                                        <li key={idx}>⛔ {i}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Galería en carrusel */}
                    <div className="mt-4">
                        <h5 className="mb-2">Galería</h5>
                        <GalleryCarousel images={data.gallery} />
                    </div>
                </div>

                {/* Col derecha: Booking card sticky */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-3 position-sticky" style={{ top: 24 }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="fs-4 fw-bold">${data.price} USD</div>
                            <button
                                className={`btn btn-sm ${fav ? "btn-warning" : "btn-outline-secondary"}`}
                                onClick={handleFav}
                                aria-pressed={fav}
                            >
                                {fav ? "✓ Favorito" : "♥ Favorito"}
                            </button>
                        </div>

                        <div className="text-muted small mb-3">
                            Cancelación flexible · Confirmación inmediata
                        </div>

                        <div className="d-grid gap-2">
                            <Link className="btn btn-primary" to={`/panel/booking/${data.id}/date`}>
                                Reservar ahora
                            </Link>
                            <button className="btn btn-outline-secondary" onClick={handleShare}>
                                Compartir
                            </button>
                        </div>

                        <hr />

                        <div className="small text-muted">
                            <div className="d-flex justify-content-between">
                                <span>Calificación</span>
                                <strong>{data.rating.toFixed(1)}/5</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Duración</span>
                                <strong>{data.days} días</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Ubicación</span>
                                <strong>{data.city}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA fija en móvil */}
            <div className="d-lg-none bg-white border-top shadow-sm position-fixed bottom-0 start-0 end-0 p-2">
                <div className="container d-flex align-items-center justify-content-between">
                    <div>
                        <div className="small text-muted">Desde</div>
                        <div className="fw-bold">${data.price} USD</div>
                    </div>
                    <Link className="btn btn-primary" to={`/panel/booking/${data.id}/date`}>
                        Reservar
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default TourDetail;
