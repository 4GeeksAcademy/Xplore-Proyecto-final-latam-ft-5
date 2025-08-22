import { useState } from "react"
import { Link } from "react-router-dom"

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
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="border col-12 col-md-8 col-lg-6 rounded p-4 shadow">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-center">
                        <h3 >Iniciar sesión</h3>
                        <div>No tienes cuenta? <Link to="/signup" >crear cuenta</Link> </div>
                    </div>
                    <div className="mb-3">
                        <input className="form-control" placeholder="E-mail" name="email" type="text" value={inputValue.email} onChange={handleOnChange} />
                    </div>
                    <div className="mb-3">
                        <input className="form-control" placeholder="Contraseña" type="password" value={inputValue.password} onChange={handleOnChange} />
                    </div>
                    <button className=" p-2 mb-3 col-12 btn bg-success text-white" type="submit">Iniciar sesion</button>
                </form>
                <div className="m-2"><Link to="/recover-password">Olvide mi contraseña</Link></div>
                <button className="btn border border-danger text-danger p-2 mb-2 col-12">Iniciar con Google</button>
            </div>
        </div>
    )
}