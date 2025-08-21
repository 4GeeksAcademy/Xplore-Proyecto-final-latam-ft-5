import { useState } from "react"
import { Link } from "react-router-dom"
import SignUp from "./SignUp"

export default function Login() {
    const [inputValue, setInputValue] = useState({
        email: "",
        password: ""
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("login values", inputValue)

    }

    const handleOnChange = (e) => {
        setInputValue({ ...inputValue, [e.target.name]: e.target.value })

    }

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="border col-7 rounded p-4">
                <form onSubmit={handleSubmit}>
                    <div className="m-2">
                        <h3 >Iniciar sesión</h3>
                        <div>No tienes cuenta? <Link to="/signup" >crear cuenta</Link> </div>
                    </div>
                    <input className="rounded p-2 m-2 col-12" placeholder="E-mail" name="email" type="text" value={inputValue.email} onChange={handleOnChange} />
                    <input className="rounded p-2 m-2 col-12" placeholder="Contraseña" type="password" value={inputValue.password} onChange={handleOnChange} />
                    <button className=" p-2 m-2 col-12 btn bg-success text-white" type="submit">Iniciar sesion</button>
                </form>
                <div className="m-2"><Link to="/recover-password">Olvide mi contraseña</Link></div>
                <button className="btn border border-danger text-danger p-2 m-2 col-12">Iniciar con Google</button>
            </div>
        </div>
    )
}