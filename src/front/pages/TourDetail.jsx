import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getDetailTour } from "../utils/api";
import ErrorPage from "./ErrorPage";
import Loading from "../components/Loading";

/** ------- Mock adaptado a tus nuevos datos ------- */
const mock = (id) => ({
    id,
    title: "Throw reality simply.",
    description:
        "Budget several treat discover. Else bed certainly why spring security even. Development plant any it past reduce. Final wind test two late.",
    location: "Port Gregorytown",
    duration: "4 days",
    base_price: "63.90",
    rate: 0.9,
    popular: ["pay", "since", "accept"],
    tour_includes: ["computer", "floor"],
    tour_not_includes: ["likely"],
    images: [
        "https://static.wixstatic.com/media/a07b19_d0a8804022454b2689ee1b780e93867a~mv2.jpg/v1/fill/w_703,h_396,al_c,lg_1,q_80/a07b19_d0a8804022454b2689ee1b780e93867a~mv2.jpg",
        "https://placekitten.com/658/579",
        "https://dummyimage.com/72x954",
        "https://dummyimage.com/488x456",
        "https://picsum.photos/371/737",
        "https://picsum.photos/645/494",
    ],
});

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
                        <div
                            style={{
                                width: "100%",
                                height: "300px",       // Altura fija para desktop
                                maxHeight: "60vh",     // Máximo relativo al viewport
                                overflow: "hidden",
                                borderRadius: "0.5rem",
                            }}
                        >
                            <img
                                src={src}
                                className="d-block w-100 h-100"
                                alt={`gal-${i}`}
                                style={{ objectFit: "cover" }} // Mantiene proporción y recorta
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#${id}`}
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">Anterior</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#${id}`}
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">Siguiente</span>
            </button>
        </div>
    );
}

export function TourDetail() {
    const nav = useNavigate();
    const { tourId } = useParams();
    const [loading, setLoading] = useState(true)
    const [tourDetail, setTourDetail] = useState(null)

    const getFetchDetail = async () => {
        try {
            const response = await getDetailTour(tourId)
            setTourDetail(response)
        } catch (error) {
            console.log("error", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getFetchDetail()
    }, [])

    if (loading) return <Loading message="Cargando tours..." />;

    if (tourDetail === null) return <ErrorPage />
    return (
        <div className="container py-4">
            {/* Migas + volver */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="text-muted small">
                    <Link to="/" className="text-decoration-none">
                        Inicio
                    </Link>{" "}
                    / <Link to="/tours" className="text-decoration-none">Tours</Link> /{" "}
                    <span className="text-secondary">{tourDetail.title}</span>
                </div>
                <button className="btn btn-link text-decoration-none" onClick={() => nav(-1)}>
                    ← Volver
                </button>
            </div>

            <div className="row g-4">
                {/* Col izquierda */}
                <div className="col-lg-8">
                    <div className="rounded-4 overflow-hidden shadow-sm mb-3">
                        <img className="tour-image" src={tourDetail.images[0]} alt={tourDetail.title} />
                    </div>

                    <div className="d-flex flex-wrap align-items-center mb-2">
                        <Chip>{tourDetail.location}</Chip>
                        <Chip>{tourDetail.duration}</Chip>
                        {tourDetail.popular.map((p, i) => (
                            <Chip key={i}>{p}</Chip>
                        ))}
                    </div>

                    <h1 className="h3 fw-bold mb-1">{tourDetail.title}</h1>
                    <StarRating value={tourDetail.rate} />

                    {/* Descripción */}
                    <div className="card border-0 shadow-sm rounded-4 p-3 mb-3">
                        <h5 className="mb-2">Descripción</h5>
                        <p className="mb-0">{tourDetail.description}</p>
                    </div>

                    {/* Incluye / No incluye */}
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                <h5 className="mb-2">Incluye</h5>
                                <ul className="mb-0">
                                    {tourDetail.tour_includes.map((i, idx) => (
                                        <li key={idx}>✅ {i}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                                <h5 className="mb-2">No incluye</h5>
                                <ul className="mb-0">
                                    {tourDetail.tour_not_includes.map((i, idx) => (
                                        <li key={idx}>⛔ {i}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Galería */}
                    <div className="mt-4">
                        <h5 className="mb-2">Galería</h5>
                        <GalleryCarousel images={tourDetail.images} />
                    </div>
                </div>

                {/* Col derecha */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-3 position-sticky" style={{ top: 24 }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="fs-4 fw-bold">${tourDetail.base_price} USD</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TourDetail;
