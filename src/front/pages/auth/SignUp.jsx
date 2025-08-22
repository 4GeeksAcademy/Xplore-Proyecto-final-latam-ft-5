import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiSignup, apiLogin } from "../../utils/api";
import { saveToken } from "../../utils/auth";

export default function SignUp() {
    const nav = useNavigate();
    const [input, setInput] = useState({
        name: "",
        last_name: "",     // <- el backend espera last_name
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [msg, setMsg] = useState("");

<<<<<<< HEAD
    function onChange(e) {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
=======
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //regex para email
        return re.test(email);
    };
    const [errors, setErrors] = useState({})
>>>>>>> Dev

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");

<<<<<<< HEAD
        if (input.password !== input.confirmPassword) {
            setMsg("Las contraseñas no coinciden");
            return;
        }
        try {
            // 1) signup
            await apiSignup({
                name: input.name,
                last_name: input.last_name,
                email: input.email,
                password: input.password,
                role: "traveler",
            });
            // 2) auto-login
            const { access_token } = await apiLogin(input.email, input.password);
            saveToken(access_token);
            // 3) redirigir al panel
            nav("/panel", { replace: true });
        } catch (err) {
            setMsg(err.message || "Error al crear la cuenta");
        }
=======
        if (e.target.value.trim() !== "") {
            setErrors({ ...errors, [e.target.name]: "" });
        }

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {}

        Object.keys(inputValue).forEach((field) => {
            if (!inputValue[field].trim()) {
                newErrors[field] = "Por favor ingresa la información"
            }

        })

        if (inputValue.email && !validateEmail(inputValue.email)) {
            newErrors.email = "Por favor ingresa un correo válido"
        }

        if (inputValue.password.length <= 5) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres"
        }

        if (inputValue.password && inputValue.confirmPassword && inputValue.password !== inputValue.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas deben coincidir"
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            console.log("valores del input ok", inputValue)
        }

>>>>>>> Dev
    }



    return (
<<<<<<< HEAD
        <div className="container" style={{ maxWidth: 520, margin: "2rem auto" }}>
            <h3>Crear cuenta</h3>
            <p>¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>

            <form onSubmit={onSubmit} className="d-grid gap-2">
                <input className="form-control" name="name" placeholder="Nombre" value={input.name} onChange={onChange} />
                <input className="form-control" name="last_name" placeholder="Apellidos" value={input.last_name} onChange={onChange} />
                <input className="form-control" name="email" type="email" placeholder="E-mail" value={input.email} onChange={onChange} required />
                <input className="form-control" name="password" type="password" placeholder="Contraseña" value={input.password} onChange={onChange} required />
                <input className="form-control" name="confirmPassword" type="password" placeholder="Confirmar contraseña" value={input.confirmPassword} onChange={onChange} required />
                <button className="btn btn-success" type="submit">Registrarse</button>
                {msg && <p className="text-danger">{msg}</p>}
            </form>
        </div>
    );
=======
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="border col-12 col-md-8 col-lg-6 rounded p-4 shadow">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-center">
                        <h3 >Crear cuenta</h3>
                        <div>Ya tienes cuenta? <Link to="/login" >Iniciar sesion</Link></div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6 mb-2 mb-md-0">
                            <input className={`form-control ${errors.name ? "is-invalid" : ""}`} placeholder="Nombre" name="name" type="text" value={inputValue.name} onChange={handleOnChange} />
                            {errors.name && (
                                <div className="invalid-feedback">{errors.name}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <input className={`form-control ${errors.lastName ? "is-invalid" : ""}`} placeholder="Apellido(s)" name="lastName" type="text" value={inputValue.lastName} onChange={handleOnChange} />
                            {errors.lastName && (
                                <div className="invalid-feedback" >{errors.lastName}</div>
                            )}
                        </div>
                    </div>
                    <div className="mb-3">
                        <input className={`form-control ${errors.email ? "is-invalid" : ""}`} placeholder="E-mail" name="email" type="text" value={inputValue.email} onChange={handleOnChange} />
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <input className={`form-control ${errors.password ? "is-invalid" : ""}`} placeholder="Contraseña" type="password" name="password" value={inputValue.password} onChange={handleOnChange} />
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <input className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`} placeholder="Confirmar contraseña" type="password" name="confirmPassword" value={inputValue.confirmPassword} onChange={handleOnChange} />
                        {errors.confirmPassword && (
                            <div className="invalid-feedback">{errors.confirmPassword}</div>
                        )}
                    </div>
                    <button className=" p-2 m-2 col-12 btn bg-success text-white" type="submit">Registrarse</button>
                </form>
                <button className="btn border border-danger text-danger p-2 m-2 col-12">Iniciar con Google</button>
            </div>
        </div>

    )
>>>>>>> Dev
}
