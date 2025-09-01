import { useState, useEffect } from "react";

export default function PanelFilters({ onChange }) {
    const [q, setQ] = useState("");
    const [maxPrice, setMaxPrice] = useState(1000);
    const [cats, setCats] = useState({
        aventura: true,
        cultura: false,
        playa: false,
        montaña: true,
    });
    const [sortBy, setSortBy] = useState("relevance"); // price_asc, price_desc, rating

    useEffect(() => {
        onChange({ q, maxPrice, cats, sortBy });
    }, [q, maxPrice, cats, sortBy, onChange]);

    return (
        <aside className="card shadow-sm border-0 p-3 sticky-top" style={{ top: 90 }}>
            <h5 className="mb-3">Filtros</h5>

            <div className="mb-3">
                <label className="form-label small">Buscar</label>
                <input
                    type="text"
                    className="form-control"
                    value={q}
                    placeholder="destino, actividad..."
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="form-label small">Precio máx.: ${maxPrice}</label>
                <input
                    type="range"
                    className="form-range"
                    min="50"
                    max="2000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
            </div>

            <div className="mb-3">
                <div className="form-label small">Categorías</div>
                {Object.keys(cats).map((k) => (
                    <div className="form-check" key={k}>
                        <input
                            id={`cat-${k}`}
                            className="form-check-input"
                            type="checkbox"
                            checked={cats[k]}
                            onChange={() =>
                                setCats((c) => ({ ...c, [k]: !c[k] }))
                            }
                        />
                        <label htmlFor={`cat-${k}`} className="form-check-label text-capitalize">
                            {k}
                        </label>
                    </div>
                ))}
            </div>

            <div className="mb-2">
                <label className="form-label small">Ordenar por</label>
                <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="relevance">Relevancia</option>
                    <option value="price_asc">Precio: menor a mayor</option>
                    <option value="price_desc">Precio: mayor a menor</option>
                    <option value="rating">Mejor valorados</option>
                </select>
            </div>
        </aside>
    );
}
