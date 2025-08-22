import { useState } from "react";
import { Link } from "react-router-dom";
import '../../styles/ProveedorSignUp.css';

export default function ProveedorSignUp() {
    const [opcion, setOpcion] = useState("");
    const [paso, setPaso] = useState(1);

    const opciones = [
        "Empresa  de turismo registrada",
        "Proveedor independiente/autónomo",
        "Organización sin fines de lucro",
        "Entidad gubernamental",
    ];

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6 proveedor-sign rounded p-4">

                    {paso === 1 && (
                        <>
                            <div className="m-2">
                                <h3>Únete como proveedor de actividades</h3>
                                <p>¿Cómo gestionas tu empresa?</p>
                            </div>

                            {/* botones de selección */}
                            <div className="d-flex flex-column gap-3 m-2">
                                {opciones.map((texto, index) => (
                                    <button
                                        key={index}
                                        className={`btn btn-opcion ${opcion === texto ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={() => setOpcion(texto)}
                                    >
                                        {texto}
                                    </button>
                                ))}
                            </div>

                            {/* botones de acción */}
                            <div className="d-flex justify-content-between mt-4">
                                <Link to="/" className="btn btn-secondary">
                                    Regresa al Home
                                </Link>
                                <button
                                    className="btn btn-success"
                                    disabled={!opcion} 
                                    onClick={() => setPaso(2)}  /* PASAR A PASO 2, REV  */
                                >
                                    Continuar
                                </button>
                            </div>
                        </>
                    )}  {/* CONTINUACIÖIN A FORMULARIO*/}
                    {paso === 2 && (
                        <>
                            <div className="m-2">
                                <h3>Completa la información</h3>
                                <p>Llena los siguientes campos:</p>
                            </div>

                            <form className="m-2">
                                <div className="mb-3">
                                    <label className="form-label">Nombre Empresa</label>
                                    <input type="text" className="form-control" placeholder="Nombre empresa" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Pagina web</label>
                                    <input type="text" className="form-control" placeholder="Ingresa tu Web" />
                                </div>

                                 {/* CAMBIAR A OPCIONES DE MONEDA, ¿USE STATE?*/}
                                <div className="mb-3">
                                    <label className="form-label">moneda de pago</label>
                                    <input type="text" className="form-control" placeholder="selecciona moneda" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nombre completo</label>
                                    <input type="text" className="form-control" placeholder="Ingresa tu nombre" /> 
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Apellidos</label>
                                    <input type="text" className="form-control" placeholder="Apellidos" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input type="tel" className="form-control" placeholder="+56 9 1234 5678" />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Correo electrónico</label>
                                    <input type="email" className="form-control" placeholder="ejemplo@email.com" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input type="text" className="form-control" placeholder="Ingresa tu contraseña" />
                                </div>

                            </form>

                            {/* botones de acción */}
                            <div className="d-flex justify-content-between mt-4">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setPaso(1)}
                                >
                                    Volver
                                </button>
                                <button className="btn btn-success">
                                    Finalizar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}