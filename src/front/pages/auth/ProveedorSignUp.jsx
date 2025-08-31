import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/ProveedorSignUp.css";
import { apiProveedorSignup } from "../../utils/apiGuias";
import { saveToken } from "../../utils/auth";

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
    const [enviando, setEnviando] = useState(false);

    const opciones = [
        "Empresa de turismo registrada",
        "Proveedor independiente/autónomo",
        "Organización sin fines de lucro",
        "Entidad gubernamental",
    ];

    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const urlOk = (v) => /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]+)?(\/.*)?$/.test(v);

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


        if (contraseña !== confirmarContraseña) { fillError.confirmarContraseña = true; }
        setError(fillError);

        return Object.keys(fillError).length === 0;
    };

    const handleFinalizar = async (e) => {
        e.preventDefault();
        if (!validar()) return;

        const payload = {
            opcion,
            nombreEmpresa: nombreEmpresa.trim(),
            paginaWeb: paginaWeb.trim(),
            monedaPago,
            telefono: telefono.trim(),
            name: nombres.trim(),
            last_name: apellidos.trim(),
            email: email.trim().toLowerCase(),
            password: contraseña,
        };

        try {
            setEnviando(true);
            const r = await apiProveedorSignup(payload);
            const token = r?.access_token || r?.data?.access_token;
            if (token) {
                saveToken(token);
                navigate("/panel/tours/create", { replace: true });
            } else {
                navigate("/proveedor-aceptado", { replace: true });
            }
        } catch (err) {
            const apiMsg = err?.response?.data?.msg || err?.response?.data?.error || err?.message || "Error al registrar";
            setError((prev) => ({ ...prev, _global: apiMsg }));
        } finally {
            setEnviando(false);
        }
    };

    const cls = (key) => `form-control ${error[key] ? "is-invalid" : ""}`;

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
                            <div className="d-flex flex-column gap-3 m-2">
                                {opciones.map((texto, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className={`btn btn-opcion ${opcion === texto ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={() => setOpcion(texto)}
                                        aria-pressed={opcion === texto}
                                    >
                                        {texto}
                                    </button>
                                ))}
                                {error.opcion && <div className="text-danger small">{error.opcion}</div>}
                            </div>
                            <div className="d-flex justify-content-between mt-4">
                                <Link to="/" className="btn btn-secondary">Regresa al Home</Link>
                                <button type="button" className="btn btn-success" disabled={!opcion} onClick={() => setPaso(2)}>
                                    Continuar
                                </button>
                            </div>
                        </>
                    )}

                    {paso === 2 && (
                        <>
                            <div className="m-2">
                                <h3>Completa la información</h3>
                                <p>Llena los siguientes campos para registrarte:</p>
                                {error._global && <div className="alert alert-danger" role="alert">{error._global}</div>}
                            </div>

                            <form className="m-2" onSubmit={handleFinalizar} noValidate>
                                <div className="mb-3">
                                    <label className="form-label">Nombre Empresa</label>
                                    <input className={cls("nombreEmpresa")} value={nombreEmpresa}
                                        onChange={(e) => setNombreEmpresa(e.target.value)} maxLength={60} />
                                    {error.nombreEmpresa && <div className="invalid-feedback">{error.nombreEmpresa}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Página web</label>
                                    <input className={cls("paginaWeb")} type="url" placeholder="https://tusitio.com"
                                        value={paginaWeb} onChange={(e) => setPaginaWeb(e.target.value)} maxLength={100} />
                                    {error.paginaWeb && <div className="invalid-feedback">{error.paginaWeb}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Moneda de pago</label>
                                    <select className={`form-control ${error.monedaPago ? "border border-danger" : ""}`} placeholder="selecciona moneda" value={monedaPago}
                                        onChange={(e) => setMonedaPago(e.target.value)} >
                                        <option value="USD">$ USD - Dólar Estadounidense</option>
                                        <option value="EUR">€ EUR - Euro</option>
                                        <option value="MXN">$ MXN - Peso Mexicano</option>
                                        <option value="CLP">$ CLP - Peso Chileno</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nombres</label>
                                    <input className={cls("nombres")} value={nombres}
                                        onChange={(e) => setNombres(e.target.value)} maxLength={40} />
                                    {error.nombres && <div className="invalid-feedback">{error.nombres}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Apellidos</label>
                                    <input className={cls("apellidos")} value={apellidos}
                                        onChange={(e) => setApellidos(e.target.value)} maxLength={40} />
                                    {error.apellidos && <div className="invalid-feedback">{error.apellidos}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input className={cls("telefono")} type="tel" value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)} maxLength={20} />
                                    {error.telefono && <div className="invalid-feedback">{error.telefono}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Correo electrónico</label>
                                    <input className={cls("email")} type="email" value={email}
                                        onChange={(e) => setEmail(e.target.value)} maxLength={80} />
                                    {error.email && <div className="invalid-feedback">{error.email}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input className={cls("contraseña")} type="password" value={contraseña}
                                        onChange={(e) => setContraseña(e.target.value)} maxLength={64} />
                                    {error.contraseña && <div className="invalid-feedback">{error.contraseña}</div>}

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


