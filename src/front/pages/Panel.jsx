import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getBookings, nextBooking, BOOKINGS_UPDATED_EVENT } from "../utils/bookings";
import { isFavorite, toggleFavorite } from "../utils/favorites";
import "../styles/panel.css";

const TOURS = [
    {
        id: 1,
        title: "Viaje de Escalada",
        city: "Huaraz, Perú",
        days: 3,
        price: 450,
        rating: 4.7,
        tags: ["aventura", "montaña"],
        img: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Antropología Mística",
        city: "San Juan Chamula, MX",
        days: 2,
        price: 380,
        rating: 4.5,
        tags: ["cultura"],
        img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1600&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Viaje a Chile",
        city: "Santiago, Chile",
        days: 5,
        price: 520,
        rating: 4.8,
        tags: ["montaña", "cultura"],
        img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    },
];


/* ================================
     Carga desde API (comentada)
     ================================
  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const params = {
          q: filters.q || undefined,
          max_price: filters.max_price || undefined,
          tags: Array.from(filters.tags),
          page: 1,
          page_size: 12,
          sort: "rating_desc",
        };
        const data = await apiTours(params);
        if (!abort) setItems(data.items || []);
      } catch (e) {
        if (!abort) {
          setError(e.message || "No se pudieron cargar los tours");
          // fallback al mock para no romper la UI
          setItems(MOCK_TOURS);
        }
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => { abort = true; };
  }, [filters]);
  */




/* ======================== HELPERS (reservas) ======================== */
function normalizeBookings(raw = []) {
    const today = new Date();
    const seen = new Set();

    return (raw || [])
        .filter((b) => b && b.status === "reserved")
        .map((b) => ({ ...b, _date: new Date(b.date) }))
        .filter((b) => b._date.toString() !== "Invalid Date")
        .filter((b) => b._date >= new Date(today.toDateString()))
        .sort((a, b) => a._date - b._date)
        .filter((b) => {
            const key = `${b.tourId}-${b._date.toISOString().slice(0, 10)}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
}

function computeNext(list) {
    return list.length ? list[0] : null;
}
/* =================================================================== */


export default function Panel() {
    const [favoritesVersion, setFavoritesVersion] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [next, setNext] = useState(null);


    useEffect(() => {
        const raw = getBookings() || [];
        const clean = normalizeBookings(raw);
        setBookings(clean);
        setNext(computeNext(clean));
    }, []);

    useEffect(() => {
        const onUpd = () => {
            const raw = getBookings() || [];
            const clean = normalizeBookings(raw);
            setBookings(clean);
            setNext(computeNext(clean));
        };
        window.addEventListener(BOOKINGS_UPDATED_EVENT, onUpd);
        return () => window.removeEventListener(BOOKINGS_UPDATED_EVENT, onUpd);
    }, []);

    const bookedIds = useMemo(() => {
        const set = new Set();
        (bookings || [])
            .filter((b) => b && b.status === "reserved")
            .forEach((b) => set.add(String(b.tourId)));
        return set;
    }, [bookings]);



    /* =================================================================== */



    // refrescar si cambian favoritos en otra parte de la app
    useEffect(() => {
        const onFav = () => setFavoritesVersion((v) => v + 1);
        window.addEventListener("xplora:favorites:updated", onFav);
        return () => window.removeEventListener("xplora:favorites:updated", onFav);
    }, []);


    function FavBtn({ tour }) {
        const active = isFavorite(tour.id);
        return (
            <button
                className={`tour-heart ${active ? "active" : ""}`}
                onClick={() => {
                    // pasa el objeto completo (tiene img/city/tags)
                    toggleFavorite({
                        id: tour.id,
                        title: tour.title,
                        img: tour.img,          // será normalizado a image
                        city: tour.city,        // será normalizado a location
                        tags: tour.tags,
                        price: tour.price,
                    });
                }}
                title={active ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
                ♥
            </button>
        );
    }


    /* =================================WRAP DE PANEL================================== */


    return (
        <div className="panel-wrap" data-fv={favoritesVersion}>
            {next && (
                <div className="next-banner mb-3 d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Tu próximo viaje:</strong>{" "}
                        <span className="badge-soft me-1">{next.title}</span>
                        <span className="text-muted">
                            {new Date(next.date).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="d-flex gap-2">
                        <Link
                            className="btn btn-outline-primary btn-sm"
                            to={`/panel/reservations/${next.id}`}
                        >
                            Ver detalles
                        </Link>
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => alert("Reprogramar (mock)")}
                        >
                            Reprogramar
                        </button>
                    </div>
                </div>
            )}

            <div className="row g-4">



                {/* FILTROS */}


                <aside className="col-lg-3">
                    <div className="card-soft panel-filters">
                        <h6 className="mb-3">Filtros</h6>

                        <label className="form-label">Buscar</label>
                        <input
                            className="form-control mb-3"
                            placeholder="destino, actividad..."
                        />

                        <label className="form-label">Precio máx.</label>
                        <input
                            type="range"
                            min="100"
                            max="1500"
                            defaultValue="1000"
                            className="form-range"
                        />
                        <div className="range-value mb-3">$1000</div>

                        <label className="form-label d-block">Categorías</label>
                        <div className="form-check">
                            <input id="c1" className="form-check-input" type="checkbox" />
                            <label htmlFor="c1" className="form-check-label">
                                Aventura
                            </label>
                        </div>
                        <div className="form-check">
                            <input id="c2" className="form-check-input" type="checkbox" />
                            <label htmlFor="c2" className="form-check-label">
                                Cultura
                            </label>
                        </div>
                        <div className="form-check">
                            <input id="c3" className="form-check-input" type="checkbox" />
                            <label htmlFor="c3" className="form-check-label">
                                Playa
                            </label>
                        </div>
                        <div className="form-check">
                            <input id="c4" className="form-check-input" type="checkbox" />
                            <label htmlFor="c4" className="form-check-label">
                                Montaña
                            </label>
                        </div>

                        <div className="form-check mt-3">
                            <input id="onlyr" className="form-check-input" type="checkbox" />
                            <label htmlFor="onlyr" className="form-check-label">
                                Solo reservados
                            </label>
                        </div>
                    </div>



                    {/* LISTAS DE RESERVAS */}

                    <div className="card-soft mt-3 list-compact">
                        <h6 className="mb-2">Tus próximas reservas</h6>
                        {(!bookings || bookings.length === 0) && (
                            <small className="text-muted">Aún no tienes reservas.</small>
                        )}


                        {bookings.slice(0, 5).map((b) => (
                            <div key={b.id} className="item">
                                <div>
                                    <div className="fw-semibold text-truncate" title={b.title}>
                                        {b.title}
                                    </div>
                                    <small className="text-muted">
                                        {new Date(b.date).toLocaleDateString()} • {b.people || 1} pax
                                    </small>
                                </div>
                                <Link
                                    className="btn btn-sm btn-outline-primary"
                                    to={`/panel/reservations/${b.id}`}
                                >
                                    Ver
                                </Link>
                            </div>
                        ))}
                        {bookings.length > 5 && (
                            <div className="mt-2">
                                <Link to="/panel/reservations" className="btn btn-sm btn-light w-100">
                                    Ver todas
                                </Link>
                            </div>
                        )}
                    </div>
                </aside>







                {/* CARDS */}


                <section className="col-lg-9">
                    <h2 className="mb-3">Destacados</h2>
                    <div className="row g-4">
                        {TOURS.map((t) => {
                            const reserved = bookedIds.has(String(t.id));
                            return (
                                <div key={t.id} className="col-12 col-md-6 col-xl-4">
                                    <div className="tour-card h-100">
                                        <div
                                            className="tour-media"
                                            style={{
                                                backgroundImage: `url(${t.img})`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}
                                            role="img"
                                            aria-label={`${t.title} en ${t.city}`}
                                        >
                                            <FavBtn tour={t} />

                                            {reserved && <div className="ribbon">Reservado</div>}
                                        </div>
                                        <div className="tour-body">
                                            <div className="tour-sub">
                                                {t.city} • {t.days} días
                                            </div>
                                            <h3 className="tour-title">{t.title}</h3>
                                            <div
                                                className="d-flex align-items-center gap-1 text-warning"
                                                title={`${t.rating} / 5`}
                                                aria-label={`Calificación ${t.rating} de 5`}
                                            >
                                                {"★".repeat(5)}{" "}
                                                <small className="text-muted ms-1">{t.rating}</small>
                                            </div>
                                            <div className="d-flex flex-wrap tour-tags mt-2">
                                                {t.tags.map((tag) => (
                                                    <span key={`${t.id}-${tag}`} className="badge-soft">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="tour-cta">
                                                <div className="tour-price">${t.price} USD</div>
                                                <div className="d-flex gap-2">
                                                    <Link
                                                        className="btn btn-outline-primary btn-sm"
                                                        to={`/tour/${t.id}`}
                                                    >
                                                        Ver detalles
                                                    </Link>
                                                    {reserved ? (
                                                        <span className="btn btn-secondary btn-sm disabled">
                                                            Ya reservado
                                                        </span>
                                                    ) : (
                                                        <Link
                                                            className="btn btn-primary btn-sm"
                                                            to={`/panel/booking/${t.id}/date`}
                                                        >
                                                            Reservar
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}
