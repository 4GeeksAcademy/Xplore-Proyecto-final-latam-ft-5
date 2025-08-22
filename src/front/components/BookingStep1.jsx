import React from 'react';
import { Link } from 'react-router-dom';

export const BookingStep1 = ({ tourId }) => {
    return (
        <div className="container py-5 text-center">
            <div className="card shadow-sm p-5 mx-auto" style={{ maxWidth: '500px' }}>
                <h2 className="fw-bold mb-4">Selecciona una Fecha</h2>
                {/* Aquí iría un componente de calendario real */}
                <div className="bg-secondary text-white p-5 rounded mb-4">
                    <p>(Componente de Calendario)</p>
                </div>
                <Link to={`/reservar/${tourId}/pago`} className="btn btn-primary btn-lg">
                    Confirmar
                </Link>
            </div>
        </div>
    );
};
