import React from 'react';

export const BookingStep2 = () => {
    return (
        <div className="container py-5 text-center">
            <div className="card shadow-sm p-5 mx-auto" style={{ maxWidth: '500px' }}>
                <h2 className="fw-bold mb-4">Agregar Método de Pago</h2>
                {/* Aquí iría un formulario de pago real (ej. Stripe, PayPal) */}
                <div className="bg-secondary text-white p-5 rounded mb-4">
                    <p>(Formulario de Datos Bancarios)</p>
                </div>
                <button className="btn btn-success btn-lg">Pagar y Confirmar Reserva</button>
            </div>
        </div>
    );
};
