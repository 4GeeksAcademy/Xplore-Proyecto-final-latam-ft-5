import React, { useState, useEffect } from 'react';
import { PanelTours } from '../components/PanelTours';
import { FilterSidebar } from '../components/FilterSidebar';

export const Panel = () => {
    // --- LÓGICA FUTURA: COMENTADA ---
    // useEffect(() => {
    //     // LÓGICA DE ACCESO RESTRINGIDO
    //     // Aquí verificarás si el usuario tiene un token.
    //     // Si no lo tiene, lo rediriges a la página de login.
    //     const token = localStorage.getItem('user_token');
    //     if (!token) {
    //         // navigate('/login'); 
    //     }
    // }, []);

    // --- DATOS DE EJEMPLO (MIENTRAS EL BACKEND NO ESTÁ LISTO) ---
    // Cuando el backend esté listo, aquí harás el fetch a tu API para traer los tours.
    const mockTours = [
        { id: 1, title: 'Viaje de Escalada', guide: 'Jennifer', image: 'https://images.pexels.com/photos/2693863/pexels-photo-2693863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        { id: 2, title: 'Antropología Mística', guide: 'Dr. Armen', image: 'https://images.pexels.com/photos/163194/buddha-statue-tibet-asia-163194.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        { id: 3, title: 'Viaje a Chile', guide: 'Consuelo', image: 'https://images.pexels.com/photos/417279/pexels-photo-417279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
    ];

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-3">
                    <FilterSidebar />
                </div>
                <div className="col-md-9">
                    <h2 className="fw-bold mb-4">Destacados</h2>
                    <div className="row">
                        {mockTours.map(tour => (
                            <PanelTours key={tour.id} tour={tour} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};