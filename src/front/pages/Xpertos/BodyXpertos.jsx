import React from 'react';
// import imagen1 from "/workspaces/Xplore-Proyecto-final-latam-ft-5/docs/assets/pexels-fukajaz-9762762.jpg"
// import imagenTelefono from "/workspaces/Xplore-Proyecto-final-latam-ft-5/docs/assets/Telefono-02.png"
// import imagen2 from "/workspaces/Xplore-Proyecto-final-latam-ft-5/docs/assets/pexels-david-kooijman-1969435-3591326.jpg"
// import imagen3 from "/workspaces/Xplore-Proyecto-final-latam-ft-5/docs/assets/pexels-marc-coenen-298185-3675393.jpg"
// import imagen4 from "/workspaces/Xplore-Proyecto-final-latam-ft-5/docs/assets/pexels-mikhail-nilov-8322906.jpg"
// import imagen5 from "/workspaces/Xplore-Proyecto-final-latam-ft-5/docs/assets/pexels-oscar-steiner-982093-33510678.jpg"
import './styles.css';

const Landing = () => {
    return (

        <>
            {/* Primera parte*/}
            <div className="container my-5 px-3">
                <div className="row align-items-center">
                    {/* Sección izquierda */}
                    <div className="col-md-6">
                        <h2>
                            Podrías ganar{" "}
                            <span className="text-success fw-bold">5.614 euros al mes</span> en
                            México
                        </h2>
                        <p className="mt-3">Crea un Tour en menos de 30 minutos.</p>

                        <button
                            className="btn"
                            type="button"
                            style={{ backgroundColor: "#B9E3E1", color: "#2D7363", padding: "10px 24px" }}
                        >
                            Empezar
                        </button>

                        {/* Circulos*/}
                        <div className="d-flex justify-content-between mt-5">
                            <div className="text-center">
                                <div className="rounded-circle bg-light border border-success d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "40px", height: "40px" }}>
                                    <strong>1</strong>
                                </div>
                                <p className="small">Registra tu negocio</p>
                            </div>
                            <div className="text-center">
                                <div className="rounded-circle bg-light border border-success d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "40px", height: "40px" }}>
                                    <strong>2</strong>
                                </div>
                                <p className="small">Envía tu Tour para revisión</p>
                            </div>
                            <div className="text-center">
                                <div className="rounded-circle bg-light border border-success d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "40px", height: "40px" }}>
                                    <strong>3</strong>
                                </div>
                                <p className="small">Empieza a ganar dinero</p>
                            </div>
                        </div>
                    </div>

                    {/* Sección derecha con celular */}
                    <div className="col-md-6 text-center position-relative">
                        <div className="rounded-box"></div>
                        <img
                            src="https://i.pinimg.com/736x/93/87/45/938745369df9fed5ab0c726f0b2fdb35.jpg"
                            alt="App en celular"
                            className="img-fluid image-on-top"
                        />
                    </div>
                </div>
            </div>

            {/* Segunda parte */}
            <div className="py-5" style={{ backgroundColor: "#2f6f64" }}>
                <div className="container text-white">
                    {/* Título */}
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">¿Por qué vender en Xplora Tours?</h2>
                        <p className="mb-0">Experiencias únicas y al mejor precio</p>
                    </div>

                    <div className="row align-items-center">
                        {/* Imagen izquierda */}
                        <div className="col-md-4 mb-4 mb-md-0">
                            <img
                                src={imagen1}
                                alt="imagen1"
                                className="img-fluid rounded" />
                        </div>

                        {/* Texto derecha */}
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <h5 className="fw-bold">Llega a más de 40 millones de viajeros mensuales</h5>
                                    <p>
                                        Haz llegar tu negocio turístico a los millones de viajeros por
                                        todo el mundo que visitan Xplora Tours cada mes.
                                    </p>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <h5 className="fw-bold">Llega a más de 40 millones de viajeros mensuales</h5>
                                    <p>
                                        Haz llegar tu negocio turístico a los millones de viajeros por
                                        todo el mundo que visitan Xplora Tours cada mes.
                                    </p>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <h5 className="fw-bold">Llega a más de 40 millones de viajeros mensuales</h5>
                                    <p>
                                        Haz llegar tu negocio turístico a los millones de viajeros por
                                        todo el mundo que visitan Xplora Tours cada mes.
                                    </p>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <h5 className="fw-bold">Llega a más de 40 millones de viajeros mensuales</h5>
                                    <p>
                                        Haz llegar tu negocio turístico a los millones de viajeros por
                                        todo el mundo que visitan Xplora Tours cada mes.
                                    </p>
                                </div>
                            </div>

                            {/* Botón */}
                            <div className="text-center mt-4">
                                <button
                                    className="btn"
                                    type="button"
                                    style={{ backgroundColor: "#B9E3E1", color: "#2D7363", padding: "10px 24px" }}
                                >
                                    Empezar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tercera parte */}
            <div className="py-5 bg-light px-5">
                <div className="container">
                    {/* Título */}
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-success">Actividades que admitimos</h2>
                    </div>

                    {/* Cards de actividades */}
                    <div className="row text-center">
                        <div className="col-md-3 mb-4">
                            <img
                                src={imagen2}
                                alt="Experiencias"
                                className="img-fluid rounded mb-3"
                                style={{ height: "150px" }}
                            />
                            <h5 className="fw-bold text-success">Experiencias y actividades</h5>
                            <ul className="list-unstyled text-muted small">
                                <li>Actividades deportivas</li>
                                <li>Actividades deportivas</li>
                                <li>Actividades deportivas</li>
                            </ul>
                        </div>
                        <div className="col-md-3 mb-4">
                            <img
                                src={imagen3}
                                alt="Visitas"
                                className="img-fluid rounded mb-3"
                                style={{ height: "150px" }}
                            />
                            <h5 className="fw-bold text-success">Visitas turísticas</h5>
                            <ul className="list-unstyled text-muted small">
                                <li>Actividades deportivas</li>
                                <li>Actividades deportivas</li>
                                <li>Actividades deportivas</li>
                            </ul>
                        </div>

                        <div className="col-md-3 mb-4">
                            <img
                                src={imagen4}
                                alt="Excursiones"
                                className="img-fluid rounded mb-3"
                                style={{ height: "150px" }}
                            />
                            <h5 className="fw-bold text-success">Excursiones de un día</h5>
                            <ul className="list-unstyled text-muted small">
                                <li>Actividades deportivas</li>
                                <li>Actividades deportivas</li>
                                <li>Actividades deportivas</li>
                            </ul>
                        </div>
                        <div className="col-md-3 mb-4">
                            <img
                                src={imagen5}
                                alt="Entradas"
                                className="img-fluid rounded mb-3"
                                style={{ height: "150px" }}

                            />
                            <h5 className="fw-bold text-success">Entradas</h5>
                            <ul className="list-unstyled text-muted small">
                                <li>Actividades deportivas</li>
                                <li>Actividades deportivas</li>
                                <li>Actividades deportivas</li>
                            </ul>
                        </div>
                    </div>

                    {/* Texto grande y botón */}
                    <div className="text-center mt-5">
                        <h3 className="fw-bold text-dark">
                            Conéctate sin problemas con más de 250 <br />
                            proveedores de conectividad
                        </h3>
                        <button className="btn mt-3 px-4 py-2" style={{ backgroundColor: "#B9E3E1" }}>
                            Empezar
                        </button>
                    </div>
                </div>
            </div>


            {/* Cuarta parte */}
            <div className="accordion px-5 py-3" id="accordionExample">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            ¿Qué es Xplora Tours?
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>This is the first item’s accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            ¿Quién puede registrarse?
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>This is the second item’s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            ¿Cuánto cuesta?
                        </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>This is the third item’s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                            ¿Cómo y cuándo me pagan?
                        </button>
                    </h2>
                    <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>This is the third item’s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                            ¿Qué ocurre cuando me registro?
                        </button>
                    </h2>
                    <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>This is the third item’s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                            ¿Hay alguna obligación por mi parte?
                        </button>
                    </h2>
                    <div id="collapseSix" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>This is the third item’s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It’s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Landing;