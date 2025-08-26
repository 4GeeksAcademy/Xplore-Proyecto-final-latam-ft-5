import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../../styles/ProveedorSignUp.css';
import { apiProveedorSignup } from "../../utils/apiGuias";
export default function ProveedorSignUp() {
    const navigate = useNavigate();
    const [opcion, setOpcion] = useState("");
    const [paso, setPaso] = useState(1);

    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [paginaWeb, setPaginaWeb] = useState("");
    const [monedaPago, setMonedaPago] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [confirmarContraseña, setConfirmarContraseña] = useState("");
    const [error, setError] = useState({});


    const opciones = [
        "Empresa  de turismo registrada",
        "Proveedor independiente/autónomo",
        "Organización sin fines de lucro",
        "Entidad gubernamental",
    ];
    const validar = () => {
        const fillError = {};

        if (!nombreEmpresa) fillError.nombreEmpresa = true;
        if (!paginaWeb) fillError.paginaWeb = true;
        if (!monedaPago) fillError.monedaPago = true;
        if (!nombres) fillError.nombres = true;
        if (!apellidos) fillError.apellidos = true;
        if (!telefono) fillError.telefono = true;
        if (!email || !email.includes("@")) fillError.email = true;
        if (!contraseña) fillError.contraseña = true;


        if (contraseña !== confirmarContraseña){ fillError.confirmarContraseña=true;}
        setError(fillError);

        return Object.keys(fillError).length === 0;
    };


    const handleFinalizar = async (e) => {
        e.preventDefault();

        if (validar()) {
            const data = {
                opcion,
                nombreEmpresa,
                paginaWeb,
                monedaPago,
                nombres,
                apellidos,
                telefono,
                email,
                contraseña,
                confirmarContraseña,
            };

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/proveedor/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });


                if (!response.ok) {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || 'error'}`);
                    return;
                }


                navigate("/proveedor-aceptado");

            } catch (error) {
                alert(`error: ${error.message}`);
            }
        }
    };

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
                                <p>Llena los siguientes campos:</p>d
                            </div>

                            <form className="m-2">
                                <div className="mb-3">
                                    <label className="form-label">Nombre Empresa</label>
                                    <input type="text" className={`form-control ${error.nombreEmpresa ? "border border-danger" : ""}`} placeholder="Nombre empresa" value={nombreEmpresa} maxLength={30}
                                        onChange={(e) => setNombreEmpresa(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Pagina web</label>
                                    <input type="text" className={`form-control ${error.paginaWeb ? "border border-danger" : ""}`} placeholder="Ingresa tu Web" value={paginaWeb} maxLength={30}
                                        onChange={(e) => setPaginaWeb(e.target.value)} />
                                </div>

                                {/* opciones de monedas, se pueden agregar nuevas si lo prefieren*/}
                                <div className="mb-3">
                                    <label className="form-label">moneda de pago</label>
                                    <select className={`form-control ${error.monedaPago ? "border border-danger" : ""}`} placeholder="selecciona moneda" value={monedaPago} 
                                        onChange={(e) => setMonedaPago(e.target.value)} >
                                        <option value="USD">USD - Dólar estadounidense</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="MXN">MXN - Peso mexicano</option>
                                        <option value="CLP">CLP - Peso chileno</option>
                                        </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nombres</label>
                                    <input type="text" className={`form-control ${error.nombreEmpresa ? "border border-danger" : ""}`} maxLength={20}
                                        placeholder="Ingresa tu nombre" value={nombres}
                                        onChange={(e) => setNombres(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Apellidos</label>
                                    <input type="text" className={`form-control ${error.apellidos ? "border border-danger" : ""}`} placeholder="Apellidos" value={apellidos} maxLength={20}
                                        onChange={(e) => setApellidos(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input type="telefono" className={`form-control ${error.telefono ? "border border-danger" : ""}`} placeholder="+56 9 1234 5678" value={telefono} maxLength={15}
                                        onChange={(e) => setTelefono(e.target.value)} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Correo electrónico</label>
                                    <input type="email" className={`form-control ${error.email ? "border border-danger" : ""}`} placeholder="ejemplo@email.com" value={email} maxLength={30}
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input type="password" className={`form-control ${error.contraseña ? "border border-danger" : ""}`} placeholder="Ingresa tu contraseña" value={contraseña} maxLength={15}
                                        onChange={(e) => setContraseña(e.target.value)} />

                                         <div className="mb-3">
                                    <label className="form-label">Confirma tu nueva contraseña</label>
                                    <input type="password" className={`form-control ${error.confirmarContraseña ? "border border-danger" : ""}`} placeholder="Confirma tu contraseña" value={confirmarContraseña} maxLength={15}
                                        onChange={(e) => setConfirmarContraseña(e.target.value)} />
                                        {/* validación contraseñas identicas*/}
                                        {error.confirmarContraseña && (<div className="text-danger mt-1">Las contraseñas no coinciden</div>
    )}
                                </div>
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
                                <button className="btn btn-success"
                                    onClick={handleFinalizar}>

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