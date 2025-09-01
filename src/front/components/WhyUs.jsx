import React from 'react';
import { Compass, Handshake, Sprout } from 'lucide-react';

export const WhyUs = () => {
    const iconCircleStyle = {
        width: '100px',
        height: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        border: '2px solid white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        transition: 'transform 0.3s ease',
        margin: '0 auto',
    };

    return (
        <div className="text-white py-5" style={{ backgroundColor: '#2D7363', fontFamily: 'Poppins, sans-serif' }}>
            <div className="container text-center">

                {/* Título principal */}
                <h2 className="fw-bold">¿Por qué elegirnos?</h2>
                <p className="text-light mb-5">Experiencias únicas y el mejor precio</p>

                {/* Íconos con beneficios */}
                <div className="row">
                    <div className="col-md-4 mb-5">
                        <div style={iconCircleStyle}>
                            <Compass size={48} />
                        </div>
                        <h5 className="fw-bold mt-4">Experiencias auténticas, no turísticas</h5>
                        <p className="text-light">Tours reales, diseñados por guías locales que te muestran la esencia del lugar.</p>
                    </div>

                    <div className="col-md-4 mb-5">
                        <div style={iconCircleStyle}>
                            <Handshake size={48} />
                        </div>
                        <h5 className="fw-bold mt-4">Fácil, rápido y personalizado</h5>
                        <p className="text-light">Reserva en pocos pasos, elige recorridos adaptados a tus intereses.</p>
                    </div>

                    <div className="col-md-4 mb-5">
                        <div style={iconCircleStyle}>
                            <Sprout size={48} />
                        </div>
                        <h5 className="fw-bold mt-4">Turismo con propósito</h5>
                        <p className="text-light">Apoya comunidades locales y viaja de forma responsable y sostenible.</p>
                    </div>
                </div>

                {/* Sección Sobre Xplora Tours */}
                <div className="py-5 mt-4">
                    <div className="row align-items-center">
                        <div className="col-md-7 text-start">
                            <h3 className="fw-bold">Sobre Xplora Tours</h3>
                            <p className="text-light">
                                En <strong>Xplora Tours</strong> creemos que cada lugar tiene una historia que merece ser vivida, no solo contada. Por eso diseñamos experiencias únicas que conectan a las personas con la esencia de cada destino: su gente, sus sabores, su naturaleza y su cultura. Más que vender tours, te invitamos a descubrir rincones auténticos, a caminar sin prisa y a vivir cada paso como una experiencia.
                            </p>

                            <h5 className="fw-bold mt-4">Nuestra Misión</h5>
                            <p className="text-light">
                                Crear experiencias locales que inspiren, enseñen y conecten. En Xplora Tours ayudamos a viajeros curiosos a descubrir lo mejor de cada lugar a través de rutas auténticas, guías apasionados y una plataforma sencilla que pone el mundo en tus manos.
                            </p>

                            <h5 className="fw-bold mt-4">Nuestra Visión</h5>
                            <p className="text-light">
                                Transformar la manera en que las personas exploran. Aspiramos a ser la red de tours más confiable y humana de Latinoamérica, donde cada recorrido no solo te lleva a un lugar, sino que te deja algo para siempre: una historia, una conexión, un recuerdo real.
                            </p>
                        </div>

                        <div className="col-md-5 text-center">
                            <img
                                src="https://images.pexels.com/photos/4112598/pexels-photo-4112598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                className="img-fluid shadow-lg"
                                alt="Fundador de Xplora Tours"
                                style={{ maxWidth: '300px', borderRadius: '12px' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Indicadores visuales */}
                <div className="row text-center mt-4">
                    <div className="col-md-4">
                        <h2 className="fw-bold text-white">50+</h2>
                        <p className="text-light">Destinos exclusivos</p>
                    </div>
                    <div className="col-md-4">
                        <h2 className="fw-bold text-white">1,000+</h2>
                        <p className="text-light">Clientes felices</p>
                    </div>
                    <div className="col-md-4">
                        <h2 className="fw-bold text-white">24/7</h2>
                        <p className="text-light">Atención a cliente</p>
                    </div>
                </div>

            </div>
        </div>
    );
};
