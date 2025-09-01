import "./Footer.css"; 

export const Footer = () => (
  <footer className="footer mt-auto">
    {/* Parte superior con fondo azul */}
    <div className="footer-top py-4">
      <div className="container">
        <div className="row align-items-center">
          {/* Logo + Texto */}
          <div className="col-md-6 d-flex align-items-center justify-content-center justify-content-md-start mb-3 mb-md-0">
            <i className="fas fa-globe-americas fa-3x footer-logo me-3"></i>
            <p className="footer-title mb-0">Tus sueños comienzan aquí</p>
          </div>

          {/* Buscador + Botón */}
          <div className="col-md-6 d-flex justify-content-center justify-content-md-end">
            <input
              type="text"
              className="form-control footer-input"
              placeholder="Buscar..."
            />
            <button className="btn btn-register">Regístrate</button>
          </div>
        </div>
      </div>
    </div>

    {/* Parte media - 2 columnas */}
    <div className="container py-5">
      <div className="row">
        {/* Servicios */}
        <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
          <h5 className="footer-heading">Servicios</h5>
          <div className="row">
            <div className="col-6">
              <ul className="list-unstyled">
                <li><a href="#">Tours y Experiencias</a></li>
                <li><a href="#">Traslados y Transposición</a></li>
                <li><a href="#">Hoteles y Hospedaje</a></li>
              </ul>
            </div>
            <div className="col-6">
              <ul className="list-unstyled">
                <li><a href="#">Paquetes de Viaje</a></li>
                <li><a href="#">Atención en el Aeropuerto</a></li>
                <li><a href="#">Términos y Condiciones</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="col-md-6 text-center text-md-start">
          <h5 className="footer-heading">Contáctanos</h5>
          <div className="row">
            <div className="col-6">
              <p>
                Desde el extranjero:{" "}
                <a href="tel:8005555555" className="footer-link">
                  <span className="highlight-800">800</span> 555 5555
                </a>
              </p>
              <p>
                Lada sin costo:{" "}
                <a href="tel:8005555555" className="footer-link">
                  <span className="highlight-800">800</span> 555 5555
                </a>
              </p>
            </div>
            <div className="col-6">
              <p>
                <i className="fab fa-whatsapp me-2"></i>
                Ayuda inmediata:{" "}
                <a href="tel:8005555555" className="footer-link">
                  <span className="highlight-800">800</span> 555 5555
                </a>
              </p>
              <p>
                <i className="fas fa-paper-plane me-2"></i>
                Chatea con nosotros
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Parte inferior */}
    <div className="footer-bottom py-3">
      <p className="mb-0 text-center">
        © 2025 Xplora Tours. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);
