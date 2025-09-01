import React from 'react';
import { Star } from 'lucide-react';

export const Testimonials = () => {
    return (
        <div className="testimonial-section py-5">
            <div className="container">
                <div className="row align-items-center">
                    {/* Columna de la tarjeta de testimonio */}
                    <div className="col-lg-7 mb-4 mb-lg-0">
                        <div className="testimonial-card p-5 shadow">
                            <h4 className="fw-bold">María Hernández</h4>
                            <p className="text-muted">Recorrido Centro Histórico de Morelia</p>
                            <p className="testimonial-text mt-3">
                                "No conocía bien la ciudad y me animé a reservar un tour cultural por el centro histórico con Xplora Tours. Fue mucho más de lo que esperaba. Además, todo fue fácil de reservar desde la app. Sin duda volveré a usarla para mi próximo viaje."
                            </p>
                            <div className="stars mt-4">
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                                <Star />
                            </div>
                        </div>
                    </div>

                    {/* Columna del título */}
                    <div className="col-lg-5 text-center text-lg-start">
                        <h2 className="fw-bold display-5">¿Qué opinan nuestros viajeros?</h2>
                        <p className="fs-5 mt-3">Lo que más valoramos en Xplora Travel es la felicidad de quienes viajan con nosotros. Estas son algunas historias y experiencias reales de nuestros viajeros.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};