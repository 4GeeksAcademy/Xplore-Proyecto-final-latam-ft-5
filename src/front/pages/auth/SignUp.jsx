import { useState } from "react";
import { Link } from "react-router-dom";


export default function SignUp() {
    const [inputValue, setInputValue] = useState({
        name: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("valores del input", inputValue)
    }

    const handleOnChange = (e) => {
        setInputValue({ ...inputValue, [e.target.name]: e.target.value })

    }

    return (
        <div className="d-flex justify-content-center align-items-center ">
            <div className="border col-7 rounded p-4">
                <form onSubmit={handleSubmit}>
                    <div className="m-2">
                        <h3 >Crear cuenta</h3>
                        <div>Ya tienes cuenta? <Link to="/acceder" >Iniciar sesion</Link></div>
                    </div>

                    <div className="d-flex m-2">
                        <input className="rounded p-2  col-6" placeholder="Nombre" name="name" type="text" value={inputValue.name} onChange={handleOnChange} />
                        <input className="rounded p-2 ms-3 col-6" placeholder="Apellido(s)" name="lastName" type="text" value={inputValue.lastName} onChange={handleOnChange} />
                    </div>
                    <input className="rounded p-2 m-2 col-12" placeholder="E-mail" name="email" type="text" value={inputValue.email} onChange={handleOnChange} />
                    <input className="rounded p-2 m-2 col-12" placeholder="Contraseña" type="password" value={inputValue.password} onChange={handleOnChange} />
                    <input className="rounded p-2 m-2 col-12" placeholder="Confirmar contraseña" type="password" value={inputValue.confirmPassword} onChange={handleOnChange} />
                    <button className=" p-2 m-2 col-12 btn bg-success text-white" type="submit">Registrarse</button>
                </form>
                <button className="btn border border-danger text-danger p-2 m-2 col-12">Iniciar con Google</button>
            </div>
        </div>

    )
}