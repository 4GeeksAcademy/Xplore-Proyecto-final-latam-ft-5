import React from 'react';
import { useParams } from 'react-router-dom';

export const TourDetail = () => {
    const { tourId } = useParams();

    // --- LÓGICA FUTURA: COMENTADA ---
    // , usar el tourId para buscar los datos del tour en tu API.
    // const [tourData, setTourData] = useState(null);
    // useEffect(() => {
    //     fetch(`/api/tours/${tourId}`)
    //         .then(res => res.json())
    //         .then(data => setTourData(data));
    // }, [tourId]);

    // --- DATOS DE EJEMPLO ---
    const mockTourData = {
        title: 'Viaje de Escalada',
        image: 'https://images.pexels.com/photos/2693863/pexels-photo-2693863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description: 'Una emocionante aventura de escalada en las montañas más desafiantes. Apta para todos los niveles, desde principiantes hasta expertos. Incluye todo el equipo necesario y guías certificados.'
    };

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-8">
                    <h1 className="fw-bold display-4">{mockTourData.title}</h1>
                    <img src={mockTourData.image} className="img-fluid rounded shadow-lg my-4" alt={mockTourData.title} />
                    <p className="lead">{mockTourData.description}</p>
                </div>
                <div className="col-lg-4">
                    <div className="card shadow-sm p-4">
                        <h3 className="fw-bold">$500 USD</h3>
                        <p className="text-muted">por persona</p>
                        <button className="btn btn-success btn-lg w-100 mt-3">Reserva ahora</button>
                    </div>
                </div>
            </div>
        </div>
    );
};