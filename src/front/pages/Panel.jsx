import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Panel.css";

// Mock: cámbialo por tu fetch al backend
const TOURS = [
    {
        id: 1,
        title: "Viaje de Escalada",
        location: "Huaraz, Perú",
        days: 3,
        price: 450,
        rating: 4.8,
        tags: ["aventura", "montaña"],
        image:
            "https://images.pexels.com/photos/314860/pexels-photo-314860.jpeg?auto=compress&cs=tinysrgb&w=1260",
    },
    {
        id: 2,
        title: "Antropología Mística",
        location: "San Juan Chamula, MX",
        days: 2,
        price: 380,
        rating: 4.6,
        tags: ["cultura"],
        image:
            "https://images.pexels.com/photos/314860/pexels-photo-314860.jpeg?auto=compress&cs=tinysrgb&w=1260",
    },
    {
        id: 3,
        title: "Viaje a Chile",
        location: "Santiago, Chile",
        days: 5,
        price: 520,
        rating: 4.7,
        tags: ["montaña", "cultura"],
        image:
            "https://images.pexels.com/photos/314860/pexels-photo-314860.jpeg?auto=compress&cs=tinysrgb&w=1260",
    },
];

const ALL_CATS = ["aventura", "cultura", "montaña", "playa"];

export default function Panel() {
    // Última reserva (guardada por la página de éxito)
    const lastBooking = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("lastBooking") || "null");
        } catch {
            return null;
        }
    }, []);

    // Filtros
    const [q, setQ] = useState("");
    const [maxPrice, setMaxPrice] = useState(1000);
    const [onlyReserved, setOnlyReserved] = useState(false);
    const [cats, setCats] = useState(() => new Set()); // categorías seleccionadas
    const [order, setOrder] = useState("relevance");

    // Favoritos (demo)
    const [favs, setFavs] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("favs") || "[]");
        } catch {
            return [];
        }
    });
    useEffect(() => {
        localStorage.setItem("favs", JSON.stringify(favs));
    }, [favs]);
    const toggleFav = (id) =>
        setFavs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    // Aplica filtros y orden
    const filtered = useMemo(() => {
        let list = TOURS.map((t) => ({
            ...t,
            reserved: lastBooking?.tourId === t.id,
            fav: favs.includes(t.id),
        })).filter((t) => {
            if (onlyReserved && !t.reserved) return false;
            if (t.price > maxPrice) return false;

            const qok =
                !q ||
                t.title.toLowerCase().includes(q.toLowerCase()) ||
                t.location.toLowerCase().includes(q.toLowerCase());

            const catsOk =
                cats.size === 0 ||
                Array.from(cats).every((c) => t.tags.includes(c));

            return qok && catsOk;
        });

        switch (order) {
            case "price_asc":
                list.sort((a, b) => a.price - b.price);
                break;
            case "price_desc":
                list.sort((a, b) => b.price - a.price);
                break;
            case "rating_desc":
                list.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // relevance: sin cambios
                break;
        }
        return list;
    }, [q, maxPrice, onlyReserved, cats, order, favs, lastBooking]);

    const onToggleCat = (c) =>
        setCats((prev) => {
            const next = new Set(prev);
            next.has(c) ? next.delete(c) : next.add(c);
            return next;
        });

    return (
        <div className="container py-4 panel-container">
            {lastBooking && (
                <div className="next-trip alert alert-success d-flex align-items-center gap-3">
                    <span className="badge bg-success-subtle text-success fw-semibold">Reservado</span>
                    <div className="small">
                        Tu próximo viaje: <strong>Tour #{lastBooking.tourId}</strong>
                        {lastBooking.date && <> · {lastBooking.date}</>}
                    </div>
                    <div className="ms-auto d-none d-sm-block">
                        <Link to={`/panel/booking/${lastBooking.tourId}/date`} className="btn btn-outline-success btn-sm">
                            Reprogramar
                        </Link>
                    </div>
                </div>
            )}

            <div className="d-flex align-items-center gap-3 results-bar">
                <h2 className="h4 fw-bold mb-0">Destacados</h2>
                <span className="text-muted small">{filtered.length} resultados</span>
                <div className="ms-auto d-flex align-items-center gap-2">
                    <label className="small text-muted mb-0">Ordenar</label>
                    <select
                        className="form-select form-select-sm w-auto"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                    >
                        <option value="relevance">Relevancia</option>
                        <option value="price_asc">Precio ↑</option>
                        <option value="price_desc">Precio ↓</option>
                        <option value="rating_desc">Mejor valorados</option>
                    </select>
                </div>
            </div>

            <div className="panel-grid">
                {/* Filtros */}
                <aside className="filters-card card-elevated">
                    <h6 className="fw-semibold small mb-3">Filtros</h6>

                    <label className="form-label tiny mt-1">Buscar</label>
                    <input
                        className="form-control form-control-sm"
                        placeholder="destino, actividad..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />

                    <div className="mt-3">
                        <div className="d-flex justify-content-between tiny">
                            <span className="text-muted">Precio máx:</span>
                            <strong>${maxPrice}</strong>
                        </div>
                        <input
                            type="range"
                            className="form-range"
                            min={100}
                            max={1000}
                            step={10}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                        />
                    </div>

                    <div className="mt-3">
                        <div className="tiny text-muted mb-2">Categorías</div>
                        {ALL_CATS.map((c) => (
                            <div className="form-check tiny" key={c}>
                                <input
                                    id={`cat-${c}`}
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={cats.has(c)}
                                    onChange={() => onToggleCat(c)}
                                />
                                <label htmlFor={`cat-${c}`} className="form-check-label text-capitalize">
                                    {c}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="form-check tiny mt-3">
                        <input
                            id="onlyReserved"
                            className="form-check-input"
                            type="checkbox"
                            checked={onlyReserved}
                            onChange={(e) => setOnlyReserved(e.target.checked)}
                        />
                        <label htmlFor="onlyReserved" className="form-check-label">
                            Solo reservados
                        </label>
                    </div>
                </aside>

                {/* Cards */}
                <section>
                    <div className="row g-4">
                        {filtered.map((t) => (
                            <article key={t.id} className="col-12 col-sm-6 col-lg-4">
                                <div className="tour-card card-elevated">
                                    <div className="thumb-wrap">
                                        <img src={t.image} alt={t.title} className="thumb" />
                                        <button
                                            className={`fav-btn ${t.fav ? "is-fav" : ""}`}
                                            onClick={() => toggleFav(t.id)}
                                            aria-label="Favorito"
                                            type="button"
                                        >
                                            {t.fav ? "♥" : "♡"}
                                        </button>
                                        {t.reserved && <span className="ribbon">Reservado</span>}
                                    </div>

                                    <div className="p-3">
                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                            <h3 className="card-title-trim mb-0">{t.title}</h3>
                                            <div className="rating" title={`${t.rating} / 5`}>
                                                ★★★★★
                                                <span className="rating-mask" style={{ width: `${(1 - t.rating / 5) * 100}%` }} />
                                            </div>
                                        </div>

                                        <div className="meta tiny text-muted mb-2">
                                            {t.location} · {t.days} días
                                        </div>

                                        <div className="mb-3">
                                            {t.tags.map((tag) => (
                                                <span key={tag} className="tag">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <div className="price">${t.price} USD</div>
                                                <div className="tiny text-muted">por persona</div>
                                            </div>

                                            <div className="d-flex gap-2">
                                                <Link to={`/tour/${t.id}`} className="btn btn-outline-primary btn-sm">
                                                    Ver detalles
                                                </Link>

                                                <Link
                                                    to={`/panel/booking/${t.id}/date`}
                                                    className={`btn btn-primary btn-sm ${t.reserved ? "disabled" : ""}`}
                                                    aria-disabled={t.reserved}
                                                    onClick={(e) => t.reserved && e.preventDefault()}
                                                >
                                                    {t.reserved ? "Ya reservado" : "Reservar"}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
