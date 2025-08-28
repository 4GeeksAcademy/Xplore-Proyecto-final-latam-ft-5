import React, { useState, useEffect } from "react";
import "../styles/PerfilProveedor.css";

const TOURS = [
  {
    id: 1,
    title: "Viaje de Escalada",
    location: "Huaraz, Perú",
    days: 3,
    price: 450,
    rating: 4.8,
    tags: ["aventura", "montaña"],
    image:
      "https://images.pexels.com/photos/314860/pexels-photo-314860.jpeg?auto=compress&cs=tinysrgb&w=1260",
  },
  {
    id: 2,
    title: "Antropología Mística",
    location: "San Juan Chamula, MX",
    days: 2,
    price: 380,
    rating: 4.6,
    tags: ["cultura"],
    image:
      "https://images.pexels.com/photos/314860/pexels-photo-314860.jpeg?auto=compress&cs=tinysrgb&w=1260",
  },
  {
    id: 3,
    title: "Viaje a Chile",
    location: "Santiago, Chile",
    days: 5,
    price: 520,
    rating: 4.7,
    tags: ["montaña", "cultura"],
    image:
      "https://images.pexels.com/photos/314860/pexels-photo-314860.jpeg?auto=compress&cs=tinysrgb&w=1260",
  },
];

function PerfilProveedor() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setTimeout(() => {
          setTours(TOURS);
          setLoading(false);
        }, 1000); // Simula carga asíncrona
      } catch (err) {
        setError("No se pudieron cargar los tours");
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <img
          className="perfil-foto"
          src="https://media.licdn.com/dms/image/v2/D5603AQEYeG5alVTCbQ/profile-displayphoto-shrink_200_200/B56Zdt_DeAGQAY-/0/1749896935974?e=2147483647&v=beta&t=D1uOBa4h30RC8cyBaRnCkc7pidoWEsKkot7Ns306fBY"
          
        />
        <div className="perfil-info">
          <h3>Nombre Apellido</h3>
          <p>
            <strong>CV:</strong> Guía profesional con 10 años de experiencia.
          </p>
          <p>
            <strong>Experiencia:</strong> Turismo enfocado a experiencias locales, turismo aventura y antropología. 
            arqueológicas.
          </p>
        </div>
      </div>

      <div className="tour-list">
        {loading && <p>Cargando tours...</p>}
        {error && <p className="error">{error}</p>}
        {tours.map((tour) => (
          <div key={tour.id} className="tour-card">
            <img src={tour.image} alt={tour.title} />
            <div className="tour-content">
              <h4>{tour.title}</h4>
              <p>
                {tour.location} • {tour.days} días
              </p>
              <p>⭐ {tour.rating}</p>
              <div className="categories">
                {tour.tags.map((tag, i) => (
                  <span key={i} className="category">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="price">${tour.price} USD</p>
              <div className="buttons">
                <button>Ver detalles</button>
                <button>Reservar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="botones">
        <button className="btn-conectar">Conectar</button>
        <button className="btn-reservar">Reservar</button>
      </div>
    </div>
  );
}

export default PerfilProveedor;