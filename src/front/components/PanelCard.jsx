import React from "react";
import { Link } from "react-router-dom";



const PanelCard = ({ tour }) => {
    const img = tour.images?.[0] || ""; // tomamos la primera imagen

    return (
        <div className="col-12 col-md-6 col-xl-4">
            <div className="tour-card h-100">
                <div
                    className="tour-media"
                    style={{
                        backgroundImage: `url(${img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    role="img"
                    aria-label={`${tour.title} en ${tour.location}`}
                >
                </div>

                <div className="tour-body">
                    <div className="tour-sub">
                        {tour.location} • {tour.duration}
                    </div>

                    <h3 className="tour-title">{tour.title}</h3>

                    <div
                        className="d-flex align-items-center gap-1 text-warning"
                        title={`${tour.rate} / 5`}
                        aria-label={`Calificación ${tour.rate} de 5`}
                    >
                        {"★".repeat(5)}{" "}
                        <small className="text-muted ms-1">{tour.rate}</small>
                    </div>

                    <div className="d-flex flex-wrap tour-tags mt-2">
                        {tour.popular?.map((tag) => (
                            <span key={`${tour.id}-${tag}`} className="badge-soft">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="tour-cta mt-3">
                        <div className="tour-price">${tour.base_price} USD</div>
                        <div className="d-flex gap-2 mt-2">
                            <Link
                                className="btn btn-outline-primary btn-sm"
                                to={`/tour/${tour.id}`}
                            >
                                Ver detalles
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PanelCard;