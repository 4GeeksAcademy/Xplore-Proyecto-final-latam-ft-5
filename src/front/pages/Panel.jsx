import { Link } from "react-router-dom";

export default function Panel() {
    const mock = [
        { id: 1, title: "Viaje de Escalada" },
        { id: 2, title: "Antropología Mística" },
        { id: 3, title: "Viaje a Chile" },
    ];

    return (
        <>
            <h2 className="mb-3">Destacados</h2>
            <div className="row g-3">
                {mock.map(t => (
                    <div key={t.id} className="col-12 col-sm-6 col-lg-4">
                        <div className="card h-100">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{t.title}</h5>
                                <div className="mt-auto">
                                    <Link className="btn btn-primary"
                                        to={`/panel/booking/${t.id}/date`}>
                                        Reservar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
