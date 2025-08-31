import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Panel.css";
import { getTours } from "../utils/api";
import PanelCard from "../components/PanelCard";
import Loading from "../components/Loading";

export default function Panel() {
    const [next, setNext] = useState(null);
    const [tours, setTours] = useState([])
    const [loading, setLoading] = useState(true)

    const getData = async () => {
        try {
            const response = await getTours()
            setTours(response)
        } catch (error) {
            setTours([])
            console.log("error", error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        // Carga segura de reservas
        getData()
    }, []);
    if (loading) return <Loading message="Cargando tours..." />;

    return (
        <div className="panel-wrap">
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
                {/* FILTROS no se muestra porque no tiene funcionalidad */}
                {/* <aside className="col-lg-3">
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

                    <div className="card-soft mt-3 list-compact">
                        <h6 className="mb-2">Tus próximas reservas</h6>
                        {(!bookings || bookings.length === 0) && (
                            <small className="text-muted">Aún no tienes reservas.</small>
                        )}
                        {(bookings || []).map((b) => (
                            <div key={b.id} className="item">
                                <div>
                                    <div className="fw-semibold">{b.title}</div>
                                    <small className="text-muted">
                                        {new Date(b.date).toLocaleDateString()}
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
                    </div>
                </aside> */}

                {/* CARDS */}
                <section className="">
                    <h2 className="mb-3">Destacados</h2>
                    <div className="row g-4">


                        {tours.map((tour) => (
                            <PanelCard key={tour.id} tour={tour} />
                        ))}

                    </div>
                </section>
            </div>
        </div>
    );
}
