import React from 'react';
import { Link } from 'react-router-dom';

// La palabra "export" es la clave
export const PanelTours = ({ tour }) => {
    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0 tour-card">
                <Link to={`/tour/${tour.id}`} className="text-decoration-none text-dark">
                    <img src={tour.image} className="card-img-top" alt={tour.title} />
                    <div className="card-body">
                        <h5 className="card-title fw-bold">{tour.title}</h5>
                        <p className="card-text text-muted">Con {tour.guide}</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};