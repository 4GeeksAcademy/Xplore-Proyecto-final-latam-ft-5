// src/front/pages/PanelFavorites.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavorites, removeFavorite, clearFavorites } from "../utils/favorites";

export default function PanelFavorites() {
    const [list, setList] = useState(getFavorites());

    useEffect(() => {
        const onUpd = (e) => setList(getFavorites());
        window.addEventListener("xplora:favorites:updated", onUpd);
        return () => window.removeEventListener("xplora:favorites:updated", onUpd);
    }, []);

    if (!list.length) {
        return (
            <div className="text-center py-5">
                <h4 className="mb-2">Aún no tienes favoritos</h4>
                <p className="text-muted">Explora los tours y marca con “Favorito” los que te gusten.</p>
                <Link className="btn btn-primary" to="/">Ver tours</Link>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="m-0">Tus favoritos</h3>
                <button className="btn btn-outline-danger btn-sm" onClick={clearFavorites}>
                    Vaciar lista
                </button>
            </div>

            <div className="row g-3">
                {list.map((t) => (
                    <div key={t.id} className="col-12 col-sm-6 col-lg-4">
                        <div className="card h-100 shadow-sm">
                            {t.image ? (
                                <img src={t.image} className="card-img-top" alt={t.title} />
                            ) : (
                                <div
                                    className="card-img-top d-flex align-items-center justify-content-center bg-light"
                                    style={{ height: 170 }}
                                >
                                    <span className="text-muted">Sin imagen</span>
                                </div>
                            )}
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{t.title}</h5>
                                {t.location && <div className="small text-muted mb-2">{t.location}</div>}
                                {t.tags?.length ? (
                                    <div className="mb-2">
                                        {t.tags.slice(0, 3).map((tag) => (
                                            <span key={tag} className="badge text-bg-light me-1">{tag}</span>
                                        ))}
                                    </div>
                                ) : null}
                                <div className="mt-auto d-flex gap-2">
                                    <Link to={`/tour/${t.id}`} className="btn btn-outline-secondary btn-sm">
                                        Ver detalles
                                    </Link>
                                    <Link to={`/panel/booking/${t.id}/date`} className="btn btn-primary btn-sm">
                                        Reservar
                                    </Link>
                                    <button
                                        className="btn btn-outline-danger btn-sm ms-auto"
                                        onClick={() => removeFavorite(t.id)}
                                    >
                                        Quitar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
