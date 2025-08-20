import React from "react";
import '../styles/Jumbotron.css';

export const Jumbotron = () => {
  return (
    <section className="jumbotron">
      <div className="overlay">
        <div className="title">Ve más allá del destino</div>
        <h4>Reserva tu lugar</h4>

        <form className="search-form">
          <div className="input-group">
            <label>Destino</label>
            <input type="text" maxLength="50" placeholder="¿A dónde vamos?"/>
          </div>

          <div className="input-group">
            <label>Fecha</label>
            <input type="date"/>
          </div>

          <div className="input-group">
            <label>Pasajeros</label>
            <input type="number" min="1" max="15" placeholder="N° pasajeros" />
          </div>

          <button type="submit" className="btn-search">
       <i className="fa-solid fa-magnifying-glass"></i>Buscar
          </button>
        </form>
      </div>
    </section>
  );
};
