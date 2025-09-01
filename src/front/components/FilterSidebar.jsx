import React from 'react';

export const FilterSidebar = () => {
    return (
        <div className="p-3 bg-light rounded shadow-sm">
            <h5 className="fw-bold mb-3">Filtros</h5>
            <h6 className="fw-bold">Precio</h6>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id="price1" />
                <label className="form-check-label" htmlFor="price1">$0 - $100</label>
            </div>
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id="price2" />
                <label className="form-check-label" htmlFor="price2">$101 - $500</label>
            </div>
            {/* Puedes agregar más filtros aquí */}
        </div>
    );
};