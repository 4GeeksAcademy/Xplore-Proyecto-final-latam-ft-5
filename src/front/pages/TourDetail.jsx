import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { deleteReview, getDetailTour } from "../utils/api";
import ErrorPage from "./ErrorPage";
import Loading from "../components/Loading";
import { ReviewForm } from "../components/ReviewForm";
import { getUserLocal } from "../utils/auth";

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
    const [reviews, setReviews] = useState([])
    const user = getUserLocal()
    const getFetchDetail = async () => {
        try {
            const response = await getDetailTour(tourId)
            setReviews(response.reviews ?? [])
            setTourDetail(response)
        } catch (error) {
            console.log("error", error)
        } finally {
            setLoading(false)
        }
    }
    const handleDeleteReview = async (id) => {
        try {
            await deleteReview(id)
            setReviews(prev => prev.filter((item) => item.id !== id))
        } catch (error) {
            console.log("error borrando", error)
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

                    {reviews.length > 0 && (
                        <div className="card border-0 shadow-sm rounded-4 p-3 mb-3">
                            <h5 className="mb-3">Reviews de viajeros ({reviews.length})</h5>
                            <div className="list-group list-group-flush">
                                {reviews.map((r) => (
                                    <div key={r.id} className="list-group-item border-0 p-2 mb-2 shadow-sm rounded-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <strong>{r.user_name || "Anonimo"}</strong>
                                            <span className="text-warning">
                                                {"★".repeat(Math.floor(r.rating))}
                                                <span className="text-secondary">
                                                    {"★".repeat(5 - Math.floor(r.rating))}
                                                </span>
                                                <small className="ms-1 text-muted">{r.rating.toFixed(1)}</small>
                                            </span>
                                        </div>
                                        {r.comment && <p className="mb-0">{r.comment}</p>}
                                        <small className="text-muted">{new Date(r.created_at).toLocaleDateString()}</small>
                                        {r.user_id === user.id && (
                                            <div className="mt-2">
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteReview(r.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Col derecha */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-3 position-sticky" style={{ top: 24 }}>
                        <ReviewForm tourId={tourId} onReviewAdded={(newReview) => setReviews((prev) => [newReview, ...prev])} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TourDetail;
